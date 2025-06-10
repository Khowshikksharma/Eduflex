const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();

adminrouter.post("/checkadminlogin", admincontroller.checkAdminLogin);
adminrouter.put("/updateprofile", admincontroller.updateProfile);

adminrouter.post("/insertstudent",admincontroller.insertstudent);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.put("/updatestudent", admincontroller.updateStudent);
adminrouter.put("/changeStudentStatus", admincontroller.changeStudentStatus);

adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);
adminrouter.put("/updatefaculty", admincontroller.updateFaculty);
adminrouter.put("/changeFacultyStatus", admincontroller.changeFacultyStatus);
adminrouter.get("/viewFacultyById/:facultyId", admincontroller.viewFacultyById);

adminrouter.get("/analysis",admincontroller.analysis);

adminrouter.post("/insertCourse", admincontroller.insertCourse);
adminrouter.get("/viewCourses", admincontroller.viewCourses);
adminrouter.put("/updateCourse", admincontroller.updateCourse);
adminrouter.put("/changeCourseStatus", admincontroller.changeCourseStatus);
adminrouter.get("/viewCourseById/:ccode", admincontroller.viewCourseById);

adminrouter.post("/addCourseMapping", admincontroller.createFCMapping);
adminrouter.get("/viewFCMapping", admincontroller.viewFCMapping);

module.exports = adminrouter;
