const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String, // URL of the profile picture
    required: true,
  },
  bannerPic: {
    type: String, // URL of the banner picture
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;