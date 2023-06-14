const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/social-media-posts')
// Define the user schema
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  likes:{
    type: Number,
    required: true,
    default : 0
  },
  liked_id:{
    type: Array
  },
  comments:{
    type: Array,
    body:{
      type: String
    },
    author:{
      type:String,
      required:true
    }
  }
});

// Create the post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
