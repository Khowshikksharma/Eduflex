const facultycontroller = require('../controllers/facultycontrollers');
const express = require('express');
const facultyrouter = express.Router();

facultyrouter.post('/checkfacultylogin', facultycontroller.checkFacultyLogin);

module.exports = facultyrouter;
