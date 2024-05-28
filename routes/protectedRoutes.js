const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: {email: req.user.email} });
});

module.exports = router;
