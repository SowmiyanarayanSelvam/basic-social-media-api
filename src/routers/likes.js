const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const router = new express.Router();
const jwt = require('../middleware/jwt');

//display the number of likes
router.get('/posts/:id/likes',async (req,res)=>{
    const bearerHeader = req.headers['authorization'];
  
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);
  
    try {
      const post = await Post.findById(req.params.id)
      res.status(201).send(post.likes.toString())
    
  } catch (e) {
    console.log(e)
      res.status(500).send(e)
  }
  })
  
  //increment like
  router.post('/posts/:id/likes',async (req,res)=>{
    const bearerHeader = req.headers['authorization'];
  
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);
  
    try {
      const post = await Post.findById(req.params.id)
      // console.log(post)
      if (post.liked_id.includes(userId)){
        return res.status(401).send('already liked post')
      }
      post.liked_id.push(userId)
      post.likes+=1
      // console.log(post)
      post.save()
      res.status(201).send(post)
    
  } catch (e) {
    console.log(e)
      res.status(500).send(e)
  }
  })
  
  
  router.delete('/posts/:id/likes', async(req,res)=>{
    const bearerHeader = req.headers['authorization'];
  
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);
  
    try {
      const post = await Post.findById(req.params.id)
      // console.log(post)
      if (!post.liked_id.includes(userId)){
        return res.status(401).send('not liked post')
      }
      // console.log((post.liked_id.indexOf(userId)))
      post.liked_id.splice(post.liked_id.indexOf(userId))
      post.likes-=1
      // console.log(post)
      post.save()
      res.status(201).send(post)
    
  } catch (e) {
    console.log(e)
      res.status(500).send(e)
  }
  })

  module.exports = router