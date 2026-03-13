import express from 'express';
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getVendorSales,
    getOrders,
    updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
    .route('/')
    .post(protect, addOrderItems)
    .get(protect, authorizeRoles('Admin'), getOrders);

router.route('/mine').get(protect, getMyOrders);
router.route('/vendor/sales').get(protect, authorizeRoles('Vendor'), getVendorSales);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorizeRoles('Admin', 'Vendor'), updateOrderStatus);

export default router;
