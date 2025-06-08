const Admin = require('../models/admin');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

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

const analysis = async (req,res) =>{
  try{
    const studentCount = await Student.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    res.json({
      studentCount: studentCount,
      facultyCount: facultyCount
    });
  }
  catch(error){
    res.status(500).send(error.message);
  }
}

module.exports = {
    checkAdminLogin,
    insertstudent,
    viewstudents,
    insertfaculty,
    viewfaculties,
    analysis,
};