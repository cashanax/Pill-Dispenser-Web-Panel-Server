const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const configRoutes = require('./configRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const galleryRoutes = require('./galleryRoutes');
const protectedRoutes = require('./protectedRoutes'); // New file for protected routes

router.use('/user', userRoutes);
router.use('/config', configRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/gallery', galleryRoutes);
router.use('/protected', protectedRoutes); // Use the protected routes

module.exports = router;
