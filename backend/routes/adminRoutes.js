const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();

adminrouter.post('/checkadminlogin', admincontroller.checkAdminLogin);

module.exports = adminrouter;
