const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    
    if (!uri) {
      throw new Error('❌ No MONGO_URI found in .env file');
    }

    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000  // 5 seconds timeout
    });
    
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;