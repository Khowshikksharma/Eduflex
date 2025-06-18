const studentcontroller = require('../controllers/studentcontrollers');
const express = require('express');
const studentrouter = express.Router();

studentrouter.post('/checkstudentlogin', studentcontroller.checkStudentLogin);
studentrouter.get('/getCirculars',studentcontroller.getCirculrByRole);
studentrouter.put('/markAsRead/:id',studentcontroller.markAsRead);

module.exports = studentrouter;