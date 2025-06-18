const facultycontroller = require('../controllers/facultycontrollers');
const express = require('express');
const facultyrouter = express.Router();

facultyrouter.post('/checkfacultylogin', facultycontroller.checkFacultyLogin);
facultyrouter.get('/getCirculars',facultycontroller.getCirculrByRole);
facultyrouter.put("/markAsRead/:id",facultycontroller.markAsRead);

module.exports = facultyrouter;
