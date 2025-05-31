const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes
router.post('/register', adminController.createAdmin);
router.post('/login', adminController.login);
router.get('/:id', adminController.getProfile);

module.exports = router;