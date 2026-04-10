const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'professional', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  education: [
    {
      institution: { type: String },
      degree: { type: String },
      year: { type: String }
    }
  ],
  experience: [
    {
      company: { type: String },
      position: { type: String },
      duration: { type: String },
      description: { type: String }
    }
  ],
  bio: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
