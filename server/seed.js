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
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'],
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
        images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'],
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
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        numReviews: 42,
        vendorTag: 'tech'
    },
    {
        name: 'Noise Cancelling Headphones',
        description: 'Over-ear premium headphones with active noise cancellation and 30-hour battery life.',
        price: 299.00,
        category: 'Electronics',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
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
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        numReviews: 56,
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
        name: 'Classic Denim Jacket',
        description: 'Timeless blue denim jacket. Perfect for any casual outfit.',
        price: 65.00,
        category: 'Fashion',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        numReviews: 89,
        vendorTag: 'artisan'
    },
    // Home Decor
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
        name: 'Minimalist Wall Clock',
        description: 'Silent sweep movement wooden wall clock with a modern minimalist design.',
        price: 45.00,
        category: 'Home Decor',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        numReviews: 33,
        vendorTag: 'artisan'
    },
    // Accessories
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
        name: 'Polarized Sunglasses',
        description: 'Retro style sunglasses with UV400 polarized lenses for ultimate eye protection.',
        price: 55.00,
        category: 'Accessories',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'],
        rating: 4.7,
        numReviews: 210,
        vendorTag: 'artisan'
    },
    // Sports
    {
        name: 'Premium Yoga Mat',
        description: 'Non-slip eco-friendly yoga mat with alignment lines. Includes carrying strap.',
        price: 42.00,
        category: 'Sports',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        numReviews: 400,
        vendorTag: 'artisan'
    },
    {
        name: 'Adjustable Dumbbell Set',
        description: 'Space-saving adjustable dumbbells going from 5 to 52 lbs per dial change.',
        price: 199.00,
        category: 'Sports',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        numReviews: 120,
        vendorTag: 'tech' // Putting it in tech vendor for diversity
    },
    // Beauty
    {
        name: 'Vitamin C Face Serum',
        description: 'Brightening daily serum with Vitamin C, Hyaluronic Acid, and Vitamin E.',
        price: 28.00,
        category: 'Beauty',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'],
        rating: 4.6,
        numReviews: 310,
        vendorTag: 'artisan'
    },
    {
        name: 'Natural Bristle Hair Brush',
        description: 'Detangling wooden hair brush made with 100% natural boar bristles.',
        price: 18.00,
        category: 'Beauty',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800'],
        rating: 4.5,
        numReviews: 65,
        vendorTag: 'artisan'
    },
    // Books
    {
        name: 'The Art of Startup Focus',
        description: 'A comprehensive guide on managing time, building products, and growing your company.',
        price: 24.99,
        category: 'Books',
        stock: 300,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'],
        rating: 4.9,
        numReviews: 890,
        vendorTag: 'tech'
    },
    // Toys
    {
        name: 'Wooden Educational Blocks',
        description: 'Set of 50 handcrafted wooden alphabet and number blocks. Non-toxic paint.',
        price: 34.00,
        category: 'Toys',
        stock: 75,
        images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800'],
        rating: 4.8,
        numReviews: 110,
        vendorTag: 'artisan'
    },
    // Other
    {
        name: 'Aromatherapy Gift Set',
        description: 'Gift set containing 6 essential oils for diffusers, massages, and relaxation.',
        price: 29.99,
        category: 'Other',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1608248593842-8d760b2ebfae?auto=format&fit=crop&q=80&w=800'],
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
