const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secretKey = 'your_secret_key'; // Replace with a secure key in a real application

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (User.getUserByEmail(email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(email, hashedPassword);
    User.addUser(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  });

module.exports = router;
