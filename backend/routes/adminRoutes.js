const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();
const multer = require('multer');
const path = require('path');

const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv', 
  'text/plain'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Checking file type:', file.mimetype); // Add this line
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log('Invalid file type rejected:', file.mimetype);
    cb(new Error(`Invalid file type: ${file.mimetype}. Only ${allowedFileTypes.join(', ')} are allowed`), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10 
  }
}).array('attachments', 10); 

adminrouter.post("/checkadminlogin", admincontroller.checkAdminLogin);
adminrouter.put("/updateprofile", admincontroller.updateProfile);

adminrouter.post("/insertstudent", admincontroller.insertstudent);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.put("/updatestudent", admincontroller.updateStudent);
adminrouter.put("/changeStudentStatus", admincontroller.changeStudentStatus);
adminrouter.post("/uploadstudents", admincontroller.studentUpload);

adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);
adminrouter.put("/updatefaculty", admincontroller.updateFaculty);
adminrouter.put("/changeFacultyStatus", admincontroller.changeFacultyStatus);
adminrouter.get("/viewFacultyById/:facultyId", admincontroller.viewFacultyById);
adminrouter.post("/uploadfaculties",admincontroller.facultyUpload);
// adminrouter.get("/getFacultyID/:facultyId",admincontroller.getFacultyID);

adminrouter.get("/analysis", admincontroller.analysis);

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
  upload,
  admincontroller.sendCircular
);
adminrouter.get("/all-circulars", admincontroller.getAllCirculars);

adminrouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
  next();
});

module.exports = adminrouter;