const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const likesRouter = require('./likes')
const commentsRouter = require('./comments')
const router = new express.Router();
const jwt = require('../middleware/jwt');

async function findUserByIdAndReturnName(userId) {
    try {
      const user = await User.findById(userId).select('name');
    //   console.log(user.name)
      return user.name;
    } catch (error) {
      console.error('Error finding user:', error.message);
      return null;
    }
  }

  router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({})
        res.send(posts)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/upload-post',(req,res)=>{
    const {name, body} = req.body;
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const token = bearerHeader.split(' ')[1];
    const userId = jwt.returnUserId(token);
    // console.log(userId)
    findUserByIdAndReturnName(userId)
  .then(author => {
    const post = new Post({
        name,
        body,
        author: userId
      });
    console.log(post)

    post.save()
    .then(()=>{
        res.status(201).send()
    })
    .catch((e)=>{
      console.log(e)
        res.status(400).send(e)
    })
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
})

router.patch('/posts/:id', async (req, res) => {
    const user = await Post.findById(req.params.id)
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const token = bearerHeader.split(' ')[1];
    const userId = jwt.returnUserId(token);

    try {
        if (user.author != userId){
            return res.status(404).send('You dont have authorization')
        }
        else{
            const post = await Post.findByIdAndUpdate(req.params.id,req.body)
            post.save().then(()=>{
                res.status(201).send(post)
            }).catch(()=>{
                return res.status(404).send('not updated')
            })
        }
        
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/posts/:id', async (req, res) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).send('Unauthorized');
      }
    const userId = jwt.returnUserId(bearerHeader.split(' ')[1]);

    try {
        const post_temp = await Post.findById(req.params.id)
        if (userId != post_temp.author){
            return res.status(404).send('You dont have authorization')
        }

        const post = await Post.findByIdAndRemove(req.params.id)
        console.log(post)
        res.status(201).send()

    } catch (e) {
      console.log(e)
        res.status(500).send(e)
    }
})

router.use(likesRouter)
router.use(commentsRouter)

module.exports= router;