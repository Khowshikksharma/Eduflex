const facultycontroller = require('../controllers/facultycontrollers');
const express = require('express');
const facultyrouter = express.Router();

facultyrouter.post('/checkfacultylogin', facultycontroller.checkFacultyLogin);
facultyrouter.put('/updateProfile', facultycontroller.updateProfile);
facultyrouter.put('/changePassword', facultycontroller.changeFacultyPassword);
facultyrouter.get('/getCirculars',facultycontroller.getCirculrByRole);
facultyrouter.get('/getCircularCount/:id', facultycontroller.getCircularCount);
facultyrouter.put("/markAsRead/:id",facultycontroller.markAsRead);
facultyrouter.get('/downloadAttachment/:circularId/:attachmentId', facultycontroller.downloadAttachment);

module.exports = facultyrouter;
