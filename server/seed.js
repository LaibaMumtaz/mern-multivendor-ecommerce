import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const products = [
    {
        name: 'Organic Lavender Soap',
        description: 'Handmade organic soap with real lavender buds. Gentle on skin and fully biodegradable.',
        price: 12.00,
        category: 'Home Decor',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        numReviews: 45,
        vendorTag: 'artisan'
    },
    {
        name: 'Handcrafted Silver Ring',
        description: '925 Sterling silver ring with a minimalist brushed finish. Each piece is unique.',
        price: 45.00,
        category: 'Accessories',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        numReviews: 12,
        vendorTag: 'artisan'
    },
    {
        name: 'Vintage Leather Satchel',
        description: 'Genuine buffalo leather bag that gets better with age. Perfect for 13" laptops.',
        price: 85.00,
        category: 'Fashion',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        numReviews: 28,
        vendorTag: 'artisan'
    },
    {
        name: 'Ceramic Serving Bowl',
        description: 'Hand-thrown ceramic bowl with a unique speckled glaze. Microwave and dishwasher safe.',
        price: 38.00,
        category: 'Home Decor',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        numReviews: 15,
        vendorTag: 'artisan'
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with blue switches for a tactile clicking experience.',
        price: 120.00,
        category: 'Electronics',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'],
        rating: 4.5,
        numReviews: 89,
        vendorTag: 'electronics'
    },
    {
        name: 'Ultra-Wide 4K Monitor',
        description: '34-inch curved monitor with vibrant IPS panel. Perfect for creators and gamers.',
        price: 549.99,
        category: 'Electronics',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        numReviews: 34,
        vendorTag: 'electronics'
    },
    {
        name: 'Sustainable Hemp T-Shirt',
        description: 'Breathable, durable, and comfortable. Made from premium hemp and organic cotton blend.',
        price: 35.00,
        category: 'Fashion',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        numReviews: 56,
        vendorTag: 'artisan'
    },
    {
        name: 'Bamboo Bluetooth Speaker',
        description: 'Eco-friendly bamboo casing with high-fidelity sound and 12-hour battery life.',
        price: 59.00,
        category: 'Electronics',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        numReviews: 42,
        vendorTag: 'electronics'
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
                description: 'A community of local artisans selling handcrafted goods.'
            }
        });

        const techVendor = await User.create({
            name: 'Tech Frontier',
            email: 'tech@example.com',
            password: hashedPassword,
            role: 'Vendor',
            storeInfo: {
                name: 'Gadget Galaxy',
                description: 'Your one-stop shop for the latest electronics.'
            }
        });

        const adminUser = await User.create({
            name: 'Platform Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'Admin'
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
