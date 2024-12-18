const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: {
    type: String, // URL of the profile picture
  },
  bannerPic: {
    type: String, // URL of the banner picture
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
