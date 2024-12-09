const mongoose = require('mongoose');

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'pending' }, // Added status field for approval
});

const User = mongoose.model('User', UserSchema);

module.exports = User; // Export the model