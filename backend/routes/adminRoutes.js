const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage });

adminrouter.post("/checkadminlogin", admincontroller.checkAdminLogin);
adminrouter.put("/updateprofile", admincontroller.updateProfile);

adminrouter.post("/insertstudent",admincontroller.insertstudent);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.put("/updatestudent", admincontroller.updateStudent);
adminrouter.put("/changeStudentStatus", admincontroller.changeStudentStatus);
adminrouter.post("/uploadstudents", admincontroller.studentUpload);

adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);
adminrouter.put("/updatefaculty", admincontroller.updateFaculty);
adminrouter.put("/changeFacultyStatus", admincontroller.changeFacultyStatus);
adminrouter.get("/viewFacultyById/:facultyId", admincontroller.viewFacultyById);
adminrouter.post("/uploadfaculties", admincontroller.facultyUpload);

adminrouter.get("/analysis",admincontroller.analysis);

adminrouter.post("/insertCourse", admincontroller.insertCourse);
adminrouter.get("/viewCourses", admincontroller.viewCourses);
adminrouter.put("/updateCourse", admincontroller.updateCourse);
adminrouter.put("/changeCourseStatus", admincontroller.changeCourseStatus);
adminrouter.get("/viewCourseById/:ccode", admincontroller.viewCourseById);

adminrouter.post("/addCourseMapping", admincontroller.createFCMapping);
adminrouter.get("/viewFCMapping", admincontroller.viewFCMapping);
adminrouter.put("/updateFCMapping", admincontroller.updateFCMapping);
adminrouter.put("/changeMappingStatus", admincontroller.changeMappingStatus);

adminrouter.post(
  "/send-all-circular",
  upload.array("attachments", 10),
  admincontroller.sendCircular
);
adminrouter.get("/all-circulars", admincontroller.getAllCirculars);

module.exports = adminrouter;
