const studentcontroller = require('../controllers/studentcontrollers');
const express = require('express');
const studentrouter = express.Router();

studentrouter.post('/checkstudentlogin', studentcontroller.checkStudentLogin);
studentrouter.put('/updateProfile', studentcontroller.updateProfile);
studentrouter.put('/changePassword', studentcontroller.changeStudnetPassword);
studentrouter.get('/getCirculars',studentcontroller.getCirculrByRole);
studentrouter.put('/markAsRead/:id',studentcontroller.markAsRead);

module.exports = studentrouter;