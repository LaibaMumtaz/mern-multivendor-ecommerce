# MERN Multi-Vendor E-Commerce Platform

A professional, modern, full-stack multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It features automated multi-vendor capabilities, secure payments via Stripe, and an integrated AI-powered shopping assistant.

## 🚀 Features

### For Customers
- **AI Shopping Assistant**: Interactive chatbot for seamless product discovery, recommendations, and queries.
- **Secure Checkout**: Fully integrated with Stripe for safe, real-time payment processing.
- **Order Management**: Detailed purchase history, order status updates, and tracking.
- **Modern UI**: Fully responsive, beautifully crafted interface with premium aesthetics powered by Tailwind CSS.

### For Vendors
- **Store & Dashboard Management**: A dedicated dashboard to track sales, manage inventory, and oversee store performance.
- **Product Management**: Easy-to-use forms for multi-image product listings powered by Cloudinary.
- **Earnings & Analytics**: Real-time statistics on total sales, pending payments, and net revenue after commission.

### For Administrators
- **Platform Oversight**: Centralized control center to monitor overall platform statistics, users, vendors, and global revenue.
- **Account Management**: Moderate, activate, or suspend users/vendors with a single click.
- **Commission System**: Automated platform fee deductions for each vendor sale.

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Redux Toolkit
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose

### Third-Party Services
- **Stripe**: Handles secure credit card processing.
- **Cloudinary**: Cloud-based storage for product images.
- **OpenAI**: Powers the Natural Language conversational chatbot.

---

## ⚙️ Setup Instructions

### Prerequisites
Before running the application locally, make sure you have:
- Node.js (v16+)
- MongoDB running locally or a MongoDB Atlas URI
- Accounts created for: **Stripe**, **Cloudinary**, and **OpenAI**

### 1. Clone the repository
```bash
git clone https://github.com/LaibaMumtaz/mern-multivendor-ecommerce.git
cd mern-multivendor-ecommerce
```

### 2. Backend Configuration
Create a `.env` file in the `server/` directory and populate the environment variables. **Never share or commit these keys:**
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=your_jwt_secret_string
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173
PLATFORM_COMMISSION_RATE=0.1
```

### 3. Install Dependencies & Run
Start both the server and the client to run the platform locally.

**Run the Backend (Server):**
```bash
cd server
npm install
npm run dev
```

**Run the Frontend (Client):**
Open a new terminal session, then:
```bash
cd client
npm install
npm run dev
```
The frontend will automatically run on `http://localhost:5173` and connect to the Express server at `http://localhost:5000/api`.

---

## 🔒 Security Notice
- The `.env` files are ignored via `.gitignore` and **must never be pushed to your GitHub repository** to avoid exposing critical API keys. 
- Ensure proper configuration inside the `.env` file for all services to work flawlessly.
