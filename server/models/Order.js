import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        items: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                image: { type: String },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                vendorId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                status: {
                    type: String,
                    enum: ['Paid', 'Shipped', 'Delivered', 'Cancelled'],
                    default: 'Paid',
                },
                itemRevenue: { type: Number, default: 0 },
                platformFee: { type: Number, default: 0 },
                vendorPayout: { type: Number, default: 0 },
            },
        ],
        shippingAddress: {
            name: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            default: 'stripe',
        },
        stripeSessionId: {
            type: String,
        },
        total: {
            type: Number,
            required: true,
            default: 0.0,
        },
        platformFee: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
