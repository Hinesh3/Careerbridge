/**
 * Run this script ONCE to create an admin user:
 * node createAdmin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const existing = await User.findOne({ email: 'admin@careerbridge.com' });
    if (existing) {
      console.log('✅ Admin already exists:', existing.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@careerbridge.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('   Email:    admin@careerbridge.com');
    console.log('   Password: admin123');
    console.log('   ID:', admin._id);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();
