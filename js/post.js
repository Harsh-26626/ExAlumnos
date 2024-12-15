const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
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
  post: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;