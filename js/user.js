const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  subscription: {
    type: String,
    enum: ['false', 'processing', 'approved'],
    default: 'false',
  },
  profilePic: {
    type: String, // URL of the profile picture
  },
  bannerPic: {
    type: String, // URL of the banner picture
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
