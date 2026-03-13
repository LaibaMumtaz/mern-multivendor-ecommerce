import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, authorizeRoles('Admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVendors = await User.countDocuments({ role: 'Vendor' });
        const totalProducts = await Product.countDocuments();

        // Calculate total orders and revenue
        const orders = await Order.find({});
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, order) => {
            if (order.status === 'Paid' || order.status === 'Delivered' || order.status === 'Shipped') {
                return acc + order.total;
            }
            return acc;
        }, 0);
        const platformCommission = orders.reduce((acc, order) => {
            if (order.status === 'Paid' || order.status === 'Delivered' || order.status === 'Shipped') {
                return acc + order.platformFee;
            }
            return acc;
        }, 0);

        res.json({
            totalUsers,
            totalVendors,
            totalProducts,
            totalOrders,
            totalRevenue,
            platformCommission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, authorizeRoles('Admin'), async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Activate/Deactivate User
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, authorizeRoles('Admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
