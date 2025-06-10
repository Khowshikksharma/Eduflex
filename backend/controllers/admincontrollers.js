const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

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

module.exports = {
    checkAdminLogin,
    updateProfile,
    insertstudent,
    viewstudents,
    updateStudent,
    insertfaculty,
    viewfaculties,
    updateFaculty,
    analysis,
    insertCourse,
    viewCourses,
    updateCourse,
};