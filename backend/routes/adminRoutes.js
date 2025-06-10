const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();

adminrouter.post("/checkadminlogin", admincontroller.checkAdminLogin);
adminrouter.put("/updateprofile", admincontroller.updateProfile);
adminrouter.post("/insertstudent",admincontroller.insertstudent);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.put("/updatestudent", admincontroller.updateStudent);
adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);
adminrouter.put("/updatefaculty", admincontroller.updateFaculty);
adminrouter.get("/analysis",admincontroller.analysis);
adminrouter.post("/insertCourse", admincontroller.insertCourse);
adminrouter.get("/viewCourses", admincontroller.viewCourses);
adminrouter.put("/updateCourse", admincontroller.updateCourse);

module.exports = adminrouter;
