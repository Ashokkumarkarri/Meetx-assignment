const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route
router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome User ID: ${req.user.userId}` });
});

module.exports = router;
