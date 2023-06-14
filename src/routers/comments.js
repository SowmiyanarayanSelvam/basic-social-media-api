const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const router = new express.Router();
const jwt = require('../middleware/jwt');

  router.get('/posts/:id/comments',async (req,res)=>{
    const bearerHeader = req.headers['authorization'];
  
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
  
    try {
      const post = await Post.findById(req.params.id)
    //   console.log(post.comments)
      if(post.comments.length == 0){
        return res.status(200).send('no commments so far')
      }
      res.status(200).send([post.comments.length+' comments',post.comments])
    
  } catch (e) {
    console.log(e)
      res.status(500).send(e)
  }
  })
  
  router.post('/posts/:id/comments',async (req,res)=>{
    const {body} = req.body;
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);
    try {
        const post = await Post.findById(req.params.id)
        // console.log(body)
        
        post.comments.push({
            body,
            author: userId
        })
        // console.log(post.comments.length)
        post.save()
        res.status(201).send([post,post.comments.length - 1])
      
    } catch (e) {
      console.log(e)
        res.status(500).send(e)
    }
  })

  router.patch('/posts/:id/comments/:commentId',async(req,res)=>{
    const commentId = parseInt(req.params.commentId);
    const {body} = req.body;
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);
    try {
        const post = await Post.findById(req.params.id)
        // console.log(body)
        if(post.comments[commentId].author != userId){
            return res.status(401).send('not authorized to edit comment')
        }
        post.comments[commentId].body = body

        post.save()
        res.status(201).send(post)
      
    } catch (e) {
      console.log(e)
        res.status(500).send(e)
    }   
  })
  
  router.delete('/posts/:id/comments/:commentId',async (req,res)=>{
    const commentId = parseInt(req.params.commentId);
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);
    try {
        const post = await Post.findById(req.params.id)
        // console.log(body)
        if(post.comments[commentId].author != userId){
            return res.status(401).send('not authorized to delete comment')
        }
        post.comments.splice(commentId,1)

        post.save()
        res.status(201).send(post)
      
    } catch (e) {
      console.log(e)
        res.status(500).send(e)
    }   
  })
  
  module.exports = router