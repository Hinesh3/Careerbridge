/**
 * Run this to change admin email and password:
 *   node change-admin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

// ============================
//  SET YOUR NEW CREDENTIALS HERE
// ============================
const NEW_EMAIL    = 'Hinesh@gmail.com';  
const NEW_PASSWORD = '123';                
// ============================

const changeAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

  const result = await User.findOneAndUpdate(
    { role: 'admin' },
    { $set: { email: NEW_EMAIL, password: hashedPassword } },
    { new: true }
  );

  if (result) {
    console.log(`✅ Admin updated!`);
    console.log(`   Email    : ${NEW_EMAIL}`);
    console.log(`   Password : ${NEW_PASSWORD}`);
  } else {
    console.log('❌ No admin user found. Run node seed.js first.');
  }

  mongoose.disconnect();
};

changeAdmin().catch(console.error);
