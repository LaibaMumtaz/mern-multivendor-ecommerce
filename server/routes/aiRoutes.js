import express from 'express';
import OpenAI from 'openai';
import Product from '../models/Product.js';

const router = express.Router();
let openai;

try {
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
} catch (error) {
    console.log('OpenAI not initialized yet');
}

// @desc    Process Chatbot Messages
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        // If no OpenAI key is set, use simple keyword fallbacks for demonstration
        if (!process.env.OPENAI_API_KEY) {
            if (message.toLowerCase().includes('order')) {
                return res.json({
                    reply: 'To track your order, please log in and navigate to your "Orders" tab.',
                    products: [],
                });
            }

            if (message.toLowerCase().includes('laptop') || message.toLowerCase().includes('computer')) {
                const products = await Product.find({
                    $or: [
                        { category: { $regex: 'laptop', $options: 'i' } },
                        { name: { $regex: 'laptop', $options: 'i' } }
                    ]
                }).limit(3);

                return res.json({
                    reply: 'Here are some laptops I found for you!',
                    products
                });
            }

            return res.json({
                reply: 'My AI brain is currently unplugged (Missing API Key), but I am here! Register an account to start selling today.',
                products: [],
            });
        }

        // OpenAI Integration
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful e-commerce assistant. Help the user find products or answer general support questions about the multi-vendor marketplace.',
                },
                { role: 'user', content: message },
            ],
            model: 'gpt-3.5-turbo',
            max_tokens: 100,
        });

        res.json({
            reply: completion.choices[0].message.content,
            products: [],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
