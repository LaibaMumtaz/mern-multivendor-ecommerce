import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { vendorId, category } = req.query;
        let query = { isActive: true };

        if (vendorId) query.vendorId = vendorId;
        if (category && category !== 'All') query.category = category;

        const products = await Product.find(query).populate(
            'vendorId',
            'name storeInfo'
        );
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'vendorId',
            'name storeInfo'
        );

        if (product && product.isActive) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
    try {
        const { name, price, description, images, category, stock } = req.body;

        const product = new Product({
            name,
            price,
            description,
            images,
            category,
            stock,
            vendorId: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, images, category, stock, isActive } =
            req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if user is the vendor of the product or an admin
            if (
                product.vendorId.toString() !== req.user._id.toString() &&
                req.user.role !== 'Admin'
            ) {
                return res
                    .status(403)
                    .json({ message: 'User not authorized to update this product' });
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.images = images || product.images;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (isActive !== undefined) product.isActive = isActive;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (
                product.vendorId.toString() !== req.user._id.toString() &&
                req.user.role !== 'Admin'
            ) {
                return res
                    .status(403)
                    .json({ message: 'User not authorized to delete this product' });
            }

            product.isActive = false;
            await product.save();
            res.json({ message: 'Product deactivated (Soft Deleted)' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor products
// @route   GET /api/products/vendor/mine
// @access  Private/Vendor
const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendorId: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private/Customer
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                res.status(400);
                throw new Error('Product already reviewed');
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);

            product.numReviews = product.reviews.length;

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    createProductReview,
};
