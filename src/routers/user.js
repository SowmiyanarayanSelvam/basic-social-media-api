const express = require('express');
const User = require('../models/user');
const router = new express.Router()
const jwt = require('../middleware/jwt')
const path = require('path')
const bcrypt = require('bcrypt')

const pagePath = path.join(__dirname,'../../templates/')

router.get('/', (req, res) => {
    res.sendFile(pagePath + '/login.html');
  });
  
  router.get('/register', (req, res) => {
    res.sendFile(pagePath+ '/register.html');
  });
  
  router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Validate login credentials and perform authentication logic
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).send('Invalid email or password');
        }
  
        // Compare the password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            // Incorrect password
            return res.status(401).send('Invalid email or password');
          }
  
          const token = jwt.generateToken(user);
          res.json({ token });
        });
      })
      .catch((error) => {
        console.error('Failed to login:', error);
        res.status(500).send('An error occurred during login.');
      });
  });
  
  router.post('/register', (req, res) => {
      const { name, email, password } = req.body;
  
      bcrypt.hash(password, 10, function (err, hashedPassword) {
          if (err) {
            console.error('Failed to hash password:', err);
            return res.status(500).send('An error occurred during registration.');
          }
      
          // Create a new user
          const user = new User({
            name,
            email,
            password: hashedPassword
          });
      
          // Save the user to the database
          user.save()
            .then(() => {
              const token = jwt.generateToken(user);
              res.json({ token });
            })
            .catch((error) => {
              console.error('Failed to register user:', error);
              res.status(500).send('An error occurred during registration.');
            });
        });
      });

      module.exports = router