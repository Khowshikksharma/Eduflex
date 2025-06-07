const studentcontroller = require('../controllers/studentcontrollers');
const express = require('express');
const studentrouter = express.Router();

studentrouter.post('/checkstudentlogin', studentcontroller.checkStudentLogin);

module.exports = studentrouter;