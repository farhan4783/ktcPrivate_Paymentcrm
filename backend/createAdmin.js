const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const email = process.env.ADMIN_EMAIL || 'digital.marketing7982@gmail.com';
    const password = process.env.ADMIN_PASSWORD || '@2004';

    // Delete existing user if exists to ensure fresh state
    await User.deleteOne({ email });

    const admin = await User.create({
      name: 'Super Admin',
      email: email,
      password: password,
      role: 'admin',
      status: 'APPROVED'
    });

    console.log('Admin account created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Status: ${admin.status}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
