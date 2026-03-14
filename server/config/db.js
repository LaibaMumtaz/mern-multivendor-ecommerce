import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    
    if (error.message.includes('MongooseServerSelectionError') || error.message.includes('whitelist')) {
      console.error('\n--- MONGODB CONNECTION TIP ---');
      console.error('This error usually means your current IP address is not whitelisted in MongoDB Atlas.');
      console.error('To fix this:');
      console.error('1. Log in to MongoDB Atlas (https://cloud.mongodb.com)');
      console.error('2. Go to "Network Access" in the left sidebar.');
      console.error('3. Click "Add IP Address" and select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) or add your current IP.');
      console.error('4. Wait for it to become "Active" and restart your server.\n');
    }
    
    process.exit(1);
  }
};

export default connectDB;
