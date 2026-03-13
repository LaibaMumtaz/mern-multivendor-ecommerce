import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const products = [
    // Electronics
    {
        name: 'Ultra-Wide 4K Gaming Monitor',
        description: '34-inch curved monitor with vibrant IPS panel. Perfect for creators and gamers.',
        price: 549.99,
        category: 'Electronics',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.9,
        numReviews: 34,
        vendorTag: 'tech'
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with blue switches for a tactile clicking experience.',
        price: 120.00,
        category: 'Electronics',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.5,
        numReviews: 89,
        vendorTag: 'tech'
    },
    {
        name: 'Bamboo Bluetooth Speaker',
        description: 'Eco-friendly bamboo casing with high-fidelity sound and 12-hour battery life.',
        price: 59.00,
        category: 'Electronics',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.8,
        numReviews: 42,
        vendorTag: 'tech'
    },
    {
        name: 'Noise Cancelling Headphones',
        description: 'Over-ear premium headphones with active noise cancellation and 30-hour battery life. Custom wood finish.',
        price: 299.00,
        category: 'Electronics',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.9,
        numReviews: 120,
        vendorTag: 'tech'
    },
    // Fashion
    {
        name: 'Sustainable Hemp T-Shirt',
        description: 'Breathable, durable, and comfortable. Made from premium hemp and organic cotton blend.',
        price: 35.00,
        category: 'Fashion',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.7,
        numReviews: 56,
        vendorTag: 'artisan'
    },
    {
        name: 'Vintage Leather Satchel',
        description: 'Genuine buffalo leather bag that gets better with age. Hand-stitched by master artisans.',
        price: 85.00,
        category: 'Fashion',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.7,
        numReviews: 28,
        vendorTag: 'artisan'
    },
    {
        name: 'Hand-dyed Silk Scarf',
        description: 'Ethereal silk scarf dyed with natural indigo and botanical extracts.',
        price: 45.00,
        category: 'Fashion',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.6,
        numReviews: 89,
        vendorTag: 'artisan'
    },
    // Home Decor
    {
        name: 'Organic Lavender Soap',
        description: 'Handmade organic soap cold-pressed with real lavender buds. Gentle on skin and fully biodegradable.',
        price: 12.00,
        category: 'Home Decor',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.9,
        numReviews: 45,
        vendorTag: 'artisan'
    },
    {
        name: 'Hand-thrown Ceramic Bowl',
        description: 'Artisan ceramic bowl with a unique speckled ash glaze. Microwave and dishwasher safe.',
        price: 38.00,
        category: 'Home Decor',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.6,
        numReviews: 15,
        vendorTag: 'artisan'
    },
    {
        name: 'Woven Macrame Wall Hanging',
        description: 'Bohemian-style macrame wall art, intricately knotted from 100% natural cotton cord.',
        price: 65.00,
        category: 'Home Decor',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.8,
        numReviews: 33,
        vendorTag: 'artisan'
    },
    {
        name: 'Hand-poured Soy Candle',
        description: 'Sandalwood and vanilla scented soy candle in a reusable amber glass jar.',
        price: 24.00,
        category: 'Home Decor',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.9,
        numReviews: 112,
        vendorTag: 'artisan'
    },
    // Accessories
    {
        name: 'Handcrafted Silver Ring',
        description: '925 Sterling silver ring with a minimalist brushed finish. Each piece is forged by hand.',
        price: 45.00,
        category: 'Accessories',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.8,
        numReviews: 12,
        vendorTag: 'artisan'
    },
    {
        name: 'Hand-stitched Leather Wallet',
        description: 'Minimalist bifold wallet crafted from full-grain vegetable-tanned leather.',
        price: 55.00,
        category: 'Accessories',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.7,
        numReviews: 210,
        vendorTag: 'artisan'
    },
    // Sports
    {
        name: 'Cork & Rubber Yoga Mat',
        description: 'Eco-friendly natural cork yoga mat with alignment lines. Antibacterial and non-slip.',
        price: 42.00,
        category: 'Sports',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.9,
        numReviews: 400,
        vendorTag: 'artisan'
    },
    {
        name: 'Hand-turned Wooden Baseball Bat',
        description: 'Custom ash wood baseball bat, turned and finished by hand for perfect balance.',
        price: 89.00,
        category: 'Sports',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1508344928928-76856bea7b06?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.8,
        numReviews: 120,
        vendorTag: 'artisan'
    },
    // Beauty
    {
        name: 'Botanical Face Serum',
        description: 'Brightening daily serum with Rosehip, Jojoba, and Vitamin E. Hand-blended in small batches.',
        price: 28.00,
        category: 'Beauty',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.6,
        numReviews: 310,
        vendorTag: 'artisan'
    },
    {
        name: 'Natural Bristle Hair Brush',
        description: 'Detangling wooden hair brush made with 100% natural boar bristles and bamboo.',
        price: 18.00,
        category: 'Beauty',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.5,
        numReviews: 65,
        vendorTag: 'artisan'
    },
    // Books
    {
        name: 'Leather-bound Journal',
        description: 'Hand-stitched leather journal containing 200 pages of thick, acid-free cotton paper.',
        price: 34.99,
        category: 'Books',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.9,
        numReviews: 890,
        vendorTag: 'artisan'
    },
    // Toys
    {
        name: 'Hand-carved Wooden Blocks',
        description: 'Set of 50 handcrafted wooden alphabet blocks, finished with non-toxic beeswax.',
        price: 45.00,
        category: 'Toys',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.8,
        numReviews: 110,
        vendorTag: 'artisan'
    },
    // Other
    {
        name: 'Apothecary Essential Oil Set',
        description: 'Hand-distilled set containing 6 pure essential oils for diffusers and relaxation.',
        price: 29.99,
        category: 'Other',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1608248593842-8d760b2ebfae?auto=format&fit=crop&q=80&w=1200'],
        rating: 4.7,
        numReviews: 245,
        vendorTag: 'artisan'
    }
];

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();

        const hashedPassword = 'admin123';

        // CREATE TWO VENDORS
        const artisanVendor = await User.create({
            name: 'Artisan Collective',
            email: 'artisan@example.com',
            password: hashedPassword,
            role: 'Vendor',
            storeInfo: {
                name: 'Handmade Haven',
                description: 'A community of local artisans selling handcrafted goods.',
                logo: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=200'
            }
        });

        const techVendor = await User.create({
            name: 'Tech Frontier',
            email: 'tech@example.com',
            password: hashedPassword,
            role: 'Vendor',
            storeInfo: {
                name: 'Gadget Galaxy',
                description: 'Your one-stop shop for the latest electronics.',
                logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200'
            }
        });

        // CREATE ADMIN
        const adminUser = await User.create({
            name: 'Platform Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'Admin'
        });

        // CREATE CUSTOMER
        const customerUser = await User.create({
            name: 'Demo Customer',
            email: 'customer@example.com',
            password: hashedPassword,
            role: 'Customer'
        });

        const sampleProducts = products.map((product) => {
            const vendorId = product.vendorTag === 'artisan' ? artisanVendor._id : techVendor._id;
            const { vendorTag, ...productData } = product;
            return { ...productData, vendorId };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported Successfully with Multi-Vendor Support!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
