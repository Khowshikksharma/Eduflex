const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const FacultyCourseMapping = require('../models/FacultyCourseMapping');

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
    const faculty = await Faculty.findOne({ id: facultyId });
    // console.log(faculty);
    if (!faculty) {
      return res.status(404).send('Faculty not found');
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const analysis = async (req,res) =>{
  try{
    const studentCount = await Student.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const courseCount = await Course.countDocuments();
    res.json({
      studentCount: studentCount,
      facultyCount: facultyCount,
      courseCount: courseCount
    });
  }
  catch(error){
    res.status(500).send(error.message);
  }
}

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
    const course = await Course.findOne
      ({ ccode: ccode });
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.json(course);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const createFCMapping = async (req, res) => {
    try {
    const { facultyId, ccode, department } = req.body;

    // Validate required fields
    if (!facultyId || !ccode || !department) {
      return res.status(400).json({ 
        message: 'Missing required fields: facultyId, ccode, or department' 
      });
    }
    
    const existingMapping = await FacultyCourseMapping.findOne({
      facultyId,
      ccode
    });

    if (existingMapping) {
      return res.status(409).json({ 
        message: 'Mapping already exists for this faculty and course' 
      });
    }

    const newMapping = new FacultyCourseMapping({
      facultyId,
      ccode,
      department,
      fmapid: req.body.fmapid || `MAP${Math.floor(1000 + Math.random() * 9000)}`,
      status: true
    });

    await newMapping.save();
    res.status(200).json(newMapping);
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
    if (mappings.length === 0) {
      return res.status(404).json({ message: 'No mappings found' });
    }
    res.json(mappings);
  } catch (error) {
    console.error('Error fetching mappings:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch faculty-course mappings' });
  }
}

module.exports = {
    checkAdminLogin,
    updateProfile,

    insertstudent,
    viewstudents,
    updateStudent,
    changeStudentStatus,

    insertfaculty,
    viewfaculties,
    updateFaculty,
    changeFacultyStatus,
    viewFacultyById,

    analysis,

    insertCourse,
    viewCourses,
    updateCourse,
    changeCourseStatus,
    viewCourseById,

    createFCMapping,
    viewFCMapping,
};