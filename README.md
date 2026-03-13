# AI-Powered Multi-Vendor E-Commerce Platform

A professional full-stack MERN (MongoDB, Express, React, Node.js) marketplace featuring multi-vendor support, secure Stripe payments, and an integrated AI-powered chatbot assistant.

## 🚀 Features

### For Customers
- **AI Shopping Assistant**: Interactive chatbot for product discovery and queries.
- **Secure Checkout**: Integrated with Stripe for seamless and safe payments.
- **Order Tracking**: Detailed purchase history and status updates.
- **Modern UI**: Fully responsive design with glassmorphism and premium aesthetics.

### For Vendors
- **Store Management**: Dedicated dashboard to track sales and products.
- **Product Listing**: Easy-to-use form with multi-image Cloudinary upload support.
- **Earnings Tracking**: Real-time stats on total sales and net revenue after commission.

### For Administrators
- **Platform Oversight**: Control center for monitoring all users, products, and global revenue.
- **User Moderation**: Activate or deactivate user accounts with a single click.
- **Fee Management**: Automated 10% platform commission logic.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, Redux Toolkit, Lucide React.
- **Backend**: Node.js, Express, MongoDB/Mongoose.
- **Services**: 
  - **Stripe**: Payment Gateway.
  - **Cloudinary**: Image Cloud Storage.
  - **OpenAI**: Natural Language Processing for Chatbot.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Stripe, Cloudinary, and OpenAI accounts.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-multi-vendor-ecommerce
```

### 2. Backend Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
FRONTEND_URL=http://localhost:5173
PLATFORM_COMMISSION_RATE=0.1
```

### 3. Frontend Configuration
The frontend automatically connects to `http://localhost:5000/api`. Ensure current URL matches in `client/src/api/axios.js`.

### 4. Install Dependencies & Run
**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 🛠️ How to Get it Working (MANDATORY STEPS)

If you haven't given me your keys yet, it's because I've set it up for YOU to safely paste them yourself in the code. **Do not share your keys with anyone!**

### Step 1: Fill the `.env` File
Open the file at `server/.env` and paste your keys from these websites:
1. **Cloudinary**: [Go to Cloudinary](https://cloudinary.com/) (Free) -> Copy `Cloud Name`, `API Key`, and `API Secret`.
2. **Stripe**: [Go to Stripe](https://stripe.com/) (Free/Test mode) -> Get your `Secret Key`.
3. **OpenAI**: [Go to OpenAI API](https://platform.openai.com/) -> Create an `API Key`.

### Step 2: Set up MongoDB
If you don't have MongoDB installed, I recommend using **MongoDB Atlas** (Free). Once you create a cluster, paste the connection string in `MONGO_URI` in the `server/.env` file.

### Step 3: Start the Backend
Open a terminal in the folder:
```powershell
cd server
npm install
npm run dev
```

### Step 4: Start the Frontend
Open ANOTHER terminal:
```powershell
cd client
npm install
npm run dev
```

### Step 5: Connecting to GitHub
To make this public:
1. Create a NEW repository on GitHub.
2. Copy the command `git remote add origin https://github.com/yourusername/reponame.git`.
3. Run that command in your project folder, then run `git push -u origin main`.

