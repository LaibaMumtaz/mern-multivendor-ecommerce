import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getVendorProducts,
    createProductReview,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(protect, authorizeRoles('Vendor', 'Admin'), createProduct);

router
    .route('/vendor/mine')
    .get(protect, authorizeRoles('Vendor'), getVendorProducts);

router.route('/:id/reviews').post(protect, createProductReview);

router
    .route('/:id')
    .get(getProductById)
    .put(protect, authorizeRoles('Vendor', 'Admin'), updateProduct)
    .delete(protect, authorizeRoles('Vendor', 'Admin'), deleteProduct);

export default router;
