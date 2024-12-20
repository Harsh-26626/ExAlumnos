const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // Should match the secret used in login

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ error: 'No token provided, authorization denied' });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Store the decoded user data (user ID, email) in request for use in protected routes
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;