# MERN Multi-Vendor E-Commerce Platform

A professional, lightweight, modern full-stack multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). 

---

## 📖 1. The Problem
Local artisans and boutique owners have no affordable digital presence.
- **Cost & Complexity:** Setting up Shopify costs money; building a custom site requires technical expertise.
- **High Commissions:** Large marketplaces (Amazon, Daraz) take 15–30% commissions and bury small sellers.
- **Time Constraints:** Existing open-source solutions are too complex for a Project timeframe.
- **Niche Focus:** Niche sellers (e.g., handmade soap brand) need a single-brand store, not a big marketplace.

## 💡 2. The Solution
A lightweight, MERN-powered platform with **two operating modes** from which the student chooses one:

1. **Multi-Vendor Mode:** Any verified user can become a vendor, list products, and receive payouts minus a predefined platform commission.
2. **Single-Vendor Mode:** One brand controls the store, ideal for a student who wants to launch their own niche e-commerce brand as a project.

*Crucially, customers always experience a seamless single-checkout flow regardless of how many sellers are in the cart.*

---

## 🏗️ 3. System Architecture & Lifecycle

### 🔄 Request-Response Lifecycle
1. **Client (React View):** User interacts with the UI (e.g., clicks "Add to Cart").
2. **State Management (Redux):** An Action is dispatched with payload data, triggering an async `Thunk` if an API call is needed.
3. **Frontend API Agent:** Axios intercepts the request, appending the JWT Authorization token, and sends an HTTP request to the Backend API.
4. **Backend Routing (Express):** The Express Router matches the endpoint and passes it through middlewares (e.g., `protect`, `authorizeRoles`).
5. **Controller Logic:** The Controller parses the request, validates data, and performs business logic.
6. **Database Access (Mongoose):** The Controller queries MongoDB models (`User`, `Product`, `Order`) for read/write operations.
7. **Response to Client:** Backend returns JSON data or error messages. React Redux updates the global state, forcing the UI components to re-render.

### 🗂️ Folder Structure (MERN)
```text
mern-multivendor-ecommerce/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/                # Axios configuration
│   │   ├── components/         # Reusable UI elements (Navbar, ProductCards)
│   │   ├── features/           # Redux slices (auth, cart, product)
│   │   ├── pages/              # Route views (Home, Admin, Vendor)
│   │   └── App.jsx             # Main router
├── server/                     # Node.js/Express Backend
│   ├── config/                 # DB connections & variables
│   ├── controllers/            # Route business logic handlers
│   ├── middlewares/            # Auth and error catching
│   ├── models/                 # Mongoose schemas (User, Product, Order)
│   ├── routes/                 # Express API endpoint definitions
│   └── index.js                # Server entry point
```

### 📊 Database Schema Blueprint
1. **User Schema:** Manages Customers, Vendors, and Admins. Holds auth credentials, roles (`Enum`), and `storeInfo` (only for Vendors).
2. **Product Schema:** Tied directly to a `vendorId` (Reference to User). Holds pricing, stock, categories, Cloudinary image URLs, and ratings.
3. **Order Schema:** Links a `buyerId` to multiple `orderItems`. Each item traces back to its original `product` and `vendor`. Tracks payment and delivery status securely via Stripe webhook metadata.

### 🌐 API Routes Architecture
- **`/api/auth`**: `POST /register`, `POST /login`, `GET /profile`, `PUT /profile`
- **`/api/products`**: `GET /` (with search queries), `POST /` (Vendor only), `PUT /:id`, `DELETE /:id`
- **`/api/orders`**: `POST /` (Checkout), `GET /myorders`, `GET /vendor`
- **`/api/admin`**: `GET /stats`, `GET /users`, `PUT /users/:id`

---

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
