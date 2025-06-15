const admincontroller = require('../controllers/admincontrollers');
const express = require('express');
const adminrouter = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage with better file naming and validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Configure multer with limits and file filter
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Max 10 files
  }
});

// Admin Authentication Routes
adminrouter.post("/checkadminlogin", admincontroller.checkAdminLogin);
adminrouter.put("/updateprofile", admincontroller.updateProfile);

// Student Management Routes
adminrouter.post("/insertstudent", admincontroller.insertstudent);
adminrouter.get("/viewstudents", admincontroller.viewstudents);
adminrouter.put("/updatestudent", admincontroller.updateStudent);
adminrouter.put("/changeStudentStatus", admincontroller.changeStudentStatus);
adminrouter.post("/uploadstudents", upload.single('file'), admincontroller.studentUpload);

// Faculty Management Routes
adminrouter.post("/insertfaculty", admincontroller.insertfaculty);
adminrouter.get("/viewfaculties", admincontroller.viewfaculties);
adminrouter.put("/updatefaculty", admincontroller.updateFaculty);
adminrouter.put("/changeFacultyStatus", admincontroller.changeFacultyStatus);
adminrouter.get("/viewFacultyById/:facultyId", admincontroller.viewFacultyById);
adminrouter.post("/uploadfaculties", upload.single('file'), admincontroller.facultyUpload);

// Analytics Route
adminrouter.get("/analysis", admincontroller.analysis);

// Course Management Routes
adminrouter.post("/insertCourse", admincontroller.insertCourse);
adminrouter.get("/viewCourses", admincontroller.viewCourses);
adminrouter.put("/updateCourse", admincontroller.updateCourse);
adminrouter.put("/changeCourseStatus", admincontroller.changeCourseStatus);
adminrouter.get("/viewCourseById/:ccode", admincontroller.viewCourseById);

// Faculty-Course Mapping Routes
adminrouter.post("/addCourseMapping", admincontroller.createFCMapping);
adminrouter.get("/viewFCMapping", admincontroller.viewFCMapping);
adminrouter.put("/updateFCMapping", admincontroller.updateFCMapping);
adminrouter.put("/changeMappingStatus", admincontroller.changeMappingStatus);

// Circular Management Routes
adminrouter.post(
  "/send-all-circular",
  upload.array("attachments", 10),
  admincontroller.sendCircular
);
adminrouter.get("/all-circulars", admincontroller.getAllCirculars);

// Error handling middleware
adminrouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    // Other errors
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
  next();
});

module.exports = adminrouter;