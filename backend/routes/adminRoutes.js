const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();

adminrouter.post('/checkadminlogin', admincontroller.checkAdminLogin);
adminrouter.post("/insertstudent",admincontroller.insertstudent);
adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);

module.exports = adminrouter;
