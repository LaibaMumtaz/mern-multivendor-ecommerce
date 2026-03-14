import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create new order & Stripe session
// @route   POST /api/orders
// @access  Private/Customer
const addOrderItems = async (req, res) => {
    const { cartItems, shippingAddress, paymentMethod } = req.body;

    if (cartItems && cartItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const platformFeeRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE) || 0.1;
        let totalAmount = 0;

        // Verify prices from DB to secure against manipulation
        const itemsFromDB = await Promise.all(
            cartItems.map(async (item) => {
                const productFromDB = await Product.findById(item.productId);
                if (!productFromDB) throw new Error(`Product not found: ${item.name}`);

                const itemRevenue = productFromDB.price * item.qty;
                const itemPlatformFee = itemRevenue * platformFeeRate;
                const vendorPayout = itemRevenue - itemPlatformFee;

                totalAmount += itemRevenue;

                return {
                    name: productFromDB.name,
                    qty: item.qty,
                    image: item.image || productFromDB.images[0],
                    price: productFromDB.price,
                    productId: productFromDB._id,
                    vendorId: productFromDB.vendorId,
                    itemRevenue,
                    platformFee: itemPlatformFee,
                    vendorPayout
                };
            })
        );

        const platformFee = totalAmount * platformFeeRate;

        const order = new Order({
            customerId: req.user._id,
            items: itemsFromDB,
            shippingAddress,
            paymentMethod,
            total: totalAmount,
            platformFee,
            status: 'Pending'
        });

        const createdOrder = await order.save();

        // Create Stripe session
        const lineItems = itemsFromDB.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.qty,
        }));

        if (!stripe) {
            return res.status(200).json({
                order: createdOrder,
                message: 'Order created, but Stripe is not configured. Please add STRIPE_SECRET_KEY to .env'
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order/${createdOrder._id}/success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
            client_reference_id: createdOrder._id.toString(),
        });

        createdOrder.stripeSessionId = session.id;
        await createdOrder.save();

        res.status(201).json({
            order: createdOrder,
            url: session.url,
            sessionUrl: session.url,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email')
            .populate('items.vendorId', 'name storeInfo');

        if (order) {
            // Check ownership
            const isVendor = order.items.some(item => item.vendorId._id.toString() === req.user._id.toString());
            if (req.user.role === 'Admin' || order.customerId._id.toString() === req.user._id.toString() || isVendor) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in customer orders
// @route   GET /api/orders/mine
// @access  Private/Customer
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor sales
// @route   GET /api/orders/vendor/sales
// @access  Private/Vendor
const getVendorSales = async (req, res) => {
    try {
        // Find all orders that contain at least one item from this vendor
        const orders = await Order.find({ 'items.vendorId': req.user._id });

        // Calculate total vendor earnings
        let totalEarnings = 0;
        let totalPlatformFee = 0;

        const vendorSales = orders.map(order => {
            // Filter items in this order that belong to the vendor
            const vendorItems = order.items.filter(item => item.vendorId.toString() === req.user._id.toString());

            const orderTotalForVendor = vendorItems.reduce((acc, item) => acc + (item.itemRevenue || 0), 0);
            const orderFeeForVendor = vendorItems.reduce((acc, item) => acc + (item.platformFee || 0), 0);
            const earned = vendorItems.reduce((acc, item) => acc + (item.vendorPayout || 0), 0);

            if (order.status === 'Paid' || order.status === 'Delivered' || order.status === 'Shipped') {
                totalEarnings += earned;
                totalPlatformFee += orderFeeForVendor;
            }

            return {
                orderId: order._id,
                date: order.createdAt,
                status: vendorItems[0]?.status || order.status,
                items: vendorItems,
                totalSales: orderTotalForVendor,
                platformFee: orderFeeForVendor,
                earned,
            }
        });

        res.json({ sales: vendorSales, totalEarnings, totalPlatformFee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('customerId', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Vendor
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const status = req.body.status;

            if (req.user.role === 'Vendor') {
                // Update only items belonging to this vendor
                let itemsUpdated = false;
                order.items.forEach(item => {
                    if (item.vendorId.toString() === req.user._id.toString()) {
                        item.status = status;
                        itemsUpdated = true;
                    }
                });

                if (!itemsUpdated) {
                    return res.status(403).json({ message: 'No items found for this vendor in this order' });
                }
            } else {
                // Admin can update global status or all items
                order.status = status || order.status;
                order.items.forEach(item => {
                    item.status = status || item.status;
                });
            }

            // Sync global status if all items are shipped/delivered
            const allShipped = order.items.every(item => ['Shipped', 'Delivered'].includes(item.status));
            const allDelivered = order.items.every(item => item.status === 'Delivered');

            if (allDelivered) order.status = 'Delivered';
            else if (allShipped) order.status = 'Shipped';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Stripe webhook handler
// @route   POST /api/orders/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).send('Stripe not configured');
    }

    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Find order by checkout session id
        const order = await Order.findOne({ stripeSessionId: session.id });

        if (order) {
            order.status = 'Paid';
            order.paidAt = Date.now();
            await order.save();

            // Decrease product stock
            for (const item of order.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.qty;
                    await product.save();
                }
            }
        }
    }

    res.status(200).end();
};

export {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getVendorSales,
    getOrders,
    updateOrderStatus,
    stripeWebhook
};
