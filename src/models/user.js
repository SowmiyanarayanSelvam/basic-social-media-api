const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/social-media-posts')
// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
