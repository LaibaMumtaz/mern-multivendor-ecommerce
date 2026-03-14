import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import { stripeWebhook } from './controllers/orderController.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

// Connect to DB immediately but don't block the file load (better for serverless)
connectDB();
console.log('Database initialization started...');

const app = express();

// CORS must come first — before rate limiter — so preflight requests get correct headers
// CORS - Allow localhost and the Vercel production URL
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://mern-multivendor-ecommerce-rho.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate Limiting (PRD Security Requirement) — after CORS to avoid blocking preflight
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // increased for development; lower in production
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS', // skip OPTIONS preflight from rate limiting
});

app.use('/api', limiter);

// Stripe webhook needs raw body, not JSON
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vendors', vendorRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
