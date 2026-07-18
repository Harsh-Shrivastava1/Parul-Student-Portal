const mongoose = require('mongoose');
const dns = require('dns');

// Fix local DNS SRV resolution issues on Windows by forcing public DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
