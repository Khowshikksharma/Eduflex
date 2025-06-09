const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();

adminrouter.post("/checkadminlogin", admincontroller.checkAdminLogin);
adminrouter.put("/updateprofile", admincontroller.updateProfile);
adminrouter.post("/insertstudent",admincontroller.insertstudent);
adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);
adminrouter.get("/analysis",admincontroller.analysis);
adminrouter.post("/insertCourse", admincontroller.insertCourse);
adminrouter.get("/viewCourses", admincontroller.viewCourses);

module.exports = adminrouter;
