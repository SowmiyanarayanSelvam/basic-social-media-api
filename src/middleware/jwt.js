const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = function generateToken(user) {
    return jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  }

  // Middleware to verify JWT token
  const verifyToken = function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
  
    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized');
      }
  
      req.userId = decoded.userId;
      next();
    });
  }
  const returnUserId = function extractUserIdFromJWT(jwtString) {
    try {
      // Decode the JWT string (without verification)
      const decoded = jwt.decode(jwtString, { complete: true });
      
      // Extract the userId from the decoded payload
      const userId = decoded.payload.userId;
      
      return userId;
    } catch (error) {
      console.error('Error extracting userId from JWT:', error.message);
      return null;
    }
  }
  

  module.exports ={
    generateToken, 
    verifyToken,
    returnUserId
  }