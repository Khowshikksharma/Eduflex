const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const FacultyCourseMapping = require('../models/FacultyCourseMapping');
const Circular = require('../models/Circular');

const departments = [
  'CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'AE', 
  'ASE', 'AUT', 'AGE', 'BIO', 'BME', 'CEE', 'CER'
];

const checkAdminLogin = async (req, res) => {
    try{
        const input = req.body;
        console.log(input);
        const admin = await Admin.findOne(input);
        res.json(admin)
    }catch(error){
        response.status(500).send(error.message); 
    }
}

const updateProfile = async (req, res) => {
  try {
    const input = req.body;
    const adminId = input.adminid; 

    const updatedAdmin = await Admin.findOneAndUpdate(
      { id: adminId }, 
      input,
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send('Admin not found');
    }

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { adminId, oldPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ id: adminId });
    if (!admin) {
      return res.status(404).json({
        status: 404,
        message: 'Admin not found'
      });
    }
    if (admin.password !== oldPassword) {
      return res.status(400).json({
        status: 400,
        message: 'Old password is incorrect'
      });
    }
    admin.password = newPassword;
    await admin.save();
    res.status(200).json({
      status: 200,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error: ' + error.message
    });
  }
};

const insertstudent = async (request, response) => {
    try 
    {
      const input = request.body;
      const student = new Student(input);
      await student.save();
      response.send('Registered Successfully');
    } 
    catch(e) 
    {
      response.status(500).send(e.message);
    }
};

const viewstudents = async(request,response) =>{
  try {
    const students = await Student.find();
    if(students.length==0){
      response.send("DATA NOT FOUND");
    }
    else{
      response.json(students);
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
 }

const updateStudent = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedStudent = await Student.findOneAndUpdate
      ({ id: id }, updateData, { new: true });
    if (!updatedStudent) {
      return res.status(404).send('Student not found');
    }
    res.json(updatedStudent);
  }
  catch (error) {
    res.status(500).send(error.message);
  }
}

const changeStudentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const updatedStudent = await Student.findOneAndUpdate(
      { id: id },
      { status: status },
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).send('Student not found');
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const studentUpload = async (req, res) => {
  try{
    await Student.insertMany(req.body);
    res.status(200).json({ success: true, message: 'Students uploaded successfully' });
  }catch(error){
    res.status(500).json({ message: error.message || 'Failed to upload students' });
  }
};

const insertfaculty = async (request, response) => {
    try 
    {
      const input = request.body;
      const faculty = new Faculty(input);
      await faculty.save();
      response.send('Registered Successfully');
    } 
    catch(e) 
    {
      response.status(500).send(e.message);
    }
}


const viewfaculties = async(request,response) =>{
    try {
        const faculties = await Faculty.find();
        if(faculties.length==0){
        response.send("DATA NOT FOUND");
        }
        else{
        response.json(faculties);
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
}

const updateFaculty = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updatedFaculty = await Faculty.findOneAndUpdate
      ({ id: id }, updateData, { new: true });
    if (!updatedFaculty) {  
      return res.status(404).send('Faculty not found');
    }
    res.json(updatedFaculty);
  }
  catch (error) {
    res.status(500).send(error.message);
  }
}

const changeFacultyStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const updatedFaculty = await Faculty.findOneAndUpdate(
      { id: id },
      { status: status },
      { new: true }
    );
    const updatedMapping = await FacultyCourseMapping.updateMany(
      { facultyId: id },
      { status: status },
      { new : true } 
    );
    if (!updatedMapping) {
      return res.status(404).send('Mapping not found');
    }
    if (!updatedFaculty) {
      return res.status(404).send('Faculty not found');
    }
    res.json(updatedFaculty);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const viewFacultyById = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const faculty = await Faculty.findOne({id: facultyId});
    if (!faculty) {
      return res.status(404).send('Faculty not found');
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const facultyUpload = async (req, res) => {
  try{
    await Faculty.insertMany(req.body);
    res.status(200).json({ success: true, message: 'Faculties uploaded successfully' });
  }catch(error){
    res.status(500).json({ message: error.message || 'Failed to upload faculties' });
  }
};

const analysis = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const courseCount = await Course.countDocuments();

    const departmentWiseCount = {};
    for (const dept of departments) {
      const count = await Student.countDocuments({ department: dept });
      departmentWiseCount[dept] = count;
    }

    res.json({
      studentCount,
      facultyCount,
      courseCount,
      departmentWiseCount
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const insertCourse = async (request, response) => {
    try 
    {
      const input = request.body;
      const course = new Course(input);
      await course.save();
      response.send('Course Registered Successfully');
    } 
    catch(e) 
    {
      response.status(500).send(e.message);
    }
};

const viewCourses = async (request, response) => {
    try {
        const courses = await Course.find();
        if(courses.length == 0) {
            response.send("No courses found");
        } else {
            response.json(courses);
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
};

const updateCourse = async (req, res) => {
  try {
    const { ccode, ...updateData } = req.body;
    const updatedCourse = await Course.findOneAndUpdate
      ({ ccode: ccode }, updateData, { new: true });
    if (!updatedCourse) {
      return res.status(404).send('Course not found');
    }
    res.json(updatedCourse);
  }
  catch (error) {
    res.status(500).send(error.message);
  }
}

const changeCourseStatus = async (req, res) => {
  try {
    const { ccode, status } = req.body;
    const updatedCourse = await Course.findOneAndUpdate(
      { ccode: ccode },
      { status: status },
      { new: true }
    );
    const updateMapping = await FacultyCourseMapping.findOneAndUpdate(
      { ccode: ccode },
      { status: status },
      { new: true }
    );
    if (!updateMapping) {
      return res.status(404).send('Mapping not found');
    }
    if (!updatedCourse) {
      return res.status(404).send('Course not found');
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const viewCourseById = async (req, res) => {
  try {
    const ccode = req.params.ccode;
    const course = await Course.findOne({ccode: ccode});
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.json(course);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const courseUpload = async (req, res) => {
  try {
    await Course.insertMany(req.body);
    res.status(200).json({ success: true, message: 'Courses uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to upload courses' });
  }
};

// admincontrollers.js - update createFCMapping
const createFCMapping = async (req, res) => {
    try {
        const { facultyId, ccode, departments, components } = req.body;

        if (!facultyId || !ccode || !departments || !components) {
            return res.status(400).json({
                message: 'Missing required fields: facultyId, ccode, departments, or components' 
            });
        }

        const faculty = await Faculty.findOne({ id: facultyId });
        if (!faculty) {
            return res.status(404).json({
                message: 'Faculty not found'
            });
        }

        const course = await Course.findOne({ ccode: ccode });
        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        const existingMapping = await FacultyCourseMapping.findOne({
            facultyId: facultyId,
            ccode: ccode
        });

        if (existingMapping) {
            return res.status(409).json({ 
                message: 'Mapping already exists for this faculty and course' 
            });
        }
        const fmapid = `MAP${Date.now().toString().slice(-6)}`;

        const newMapping = new FacultyCourseMapping({
            fmapid,
            facultyname: faculty.name,  // Added faculty name
            facultyId,
            cname: course.cname,      // Added course name
            ccode,
            departments,
            components,
            status: true
        });

        await newMapping.save();

        res.status(200).json({
            success: true,
            data: newMapping,
            message: 'Mapping created successfully'
        });
    } catch (error) {
        console.error('Error creating mapping:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to create faculty-course mapping' 
        });
    }
};

const viewFCMapping = async (req, res) => {
    try {
        const mappings = await FacultyCourseMapping.find();
        res.json(mappings);
    } catch (error) {
        console.error('Error fetching mappings:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch faculty-course mappings' });
    }
};

const updateFCMapping = async (req, res) => {
    try {
        const { fmapid, facultyId, ccode, departments, components } = req.body;

        const faculty = await Faculty.findOne({ id: facultyId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        const course = await Course.findOne({ ccode: ccode });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const existing = await FacultyCourseMapping.findOne({
            facultyId: facultyId,
            ccode: ccode,
            fmapid: { $ne: fmapid }
        });

        if (existing) {
            return res.status(409).json({
                message: 'This faculty is already mapped to this course with another mapping'
            });
        }

        const updated = await FacultyCourseMapping.findOneAndUpdate(
            { fmapid: fmapid },
            {
                facultyId,
                ccode,
                departments,
                components
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Mapping not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Server error'
        });
    }
};

const changeMappingStatus = async (req, res) => {
    try {
        const { fmapid, status } = req.body;
        const updatedMapping = await FacultyCourseMapping.findOneAndUpdate(
            { fmapid: fmapid },
            { status: status },
            { new: true }
        );

        if (!updatedMapping) {
            return res.status(404).send('Mapping not found');
        }

        res.status(200).json(updatedMapping);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const sendCircular = async (req, res) => {
  try {
    const { sentby,subject, description, recipientGroups, selectedDepartments } = req.body;

    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        name: file.originalname,
        path: file.filename,
        size: file.size
      }));
    }

    const newCircular = new Circular({
      sentby,
      subject,
      description,
      recipientGroups: JSON.parse(recipientGroups),
      selectedDepartments: JSON.parse(selectedDepartments || '[]'),
      attachments
    });

    await newCircular.save();
    res.status(201).json({ message: 'Circular sent successfully' });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message,
    });
  }
};

const getAllCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ createdAt: -1 });
    res.json(circulars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch circulars' });
  }
};

module.exports = {
    checkAdminLogin,
    updateProfile,
    changeAdminPassword,

    insertstudent,
    viewstudents,
    updateStudent,
    changeStudentStatus,
    studentUpload,

    insertfaculty,
    viewfaculties,
    updateFaculty,
    changeFacultyStatus,
    viewFacultyById,
    facultyUpload,

    analysis,

    insertCourse,
    viewCourses,
    updateCourse,
    changeCourseStatus,
    viewCourseById,
    courseUpload,

    createFCMapping,
    viewFCMapping,
    updateFCMapping,
    changeMappingStatus,

    sendCircular,
    getAllCirculars,
};