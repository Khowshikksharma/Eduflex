const studentcontroller = require('../controllers/studentcontrollers');
const express = require('express');
const studentrouter = express.Router();

studentrouter.post('/checkstudentlogin', studentcontroller.checkStudentLogin);
studentrouter.put('/updateProfile', studentcontroller.updateProfile);
studentrouter.put('/changePassword', studentcontroller.changeStudnetPassword);
studentrouter.get('/getCirculars', studentcontroller.getCirculrByRole);
studentrouter.get('/getCircularCount/:id',studentcontroller.getCircularCount);
studentrouter.put('/markAsRead/:id',studentcontroller.markAsRead);
studentrouter.get('/downloadAttachment/:circularId/:attachmentId', studentcontroller.downloadAttachment);


module.exports = studentrouter;