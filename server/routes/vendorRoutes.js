import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all vendors (Public)
// @route   GET /api/vendors
// @access  Public
router.get('/', async (req, res) => {
    try {
        const vendors = await User.find({ role: 'Vendor' }).select('name storeInfo');
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get vendor by ID (Public)
// @route   GET /api/vendors/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id).select('name storeInfo');
        if (vendor && vendor.role === 'Vendor') {
            res.json(vendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
