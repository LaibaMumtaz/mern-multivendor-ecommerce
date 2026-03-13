import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Setup Multer storage (using memory storage to pipe to cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
    '/',
    protect,
    authorizeRoles('Vendor', 'Admin'),
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image provided' });
            }

            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'ai-ecommerce-products',
            });

            res.status(200).json({
                message: 'Image uploaded successfully',
                imageUrl: result.secure_url,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Image upload failed' });
        }
    }
);

// @desc Avatar upload for any authenticated user
// @route POST /api/upload/avatar
// @access Private
router.post(
    '/avatar',
    protect,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image provided' });
            }

            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'ai-ecommerce-avatars',
                transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
            });

            res.status(200).json({
                message: 'Avatar uploaded successfully',
                imageUrl: result.secure_url,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Avatar upload failed' });
        }
    }
);

export default router;
