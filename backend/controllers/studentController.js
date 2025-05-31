const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { id: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const students = await Student.find(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const { password, ...studentData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const student = new Student({
      ...studentData,
      password: hashedPassword
    });
    
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOneAndUpdate({ id }, req.body, { new: true });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark student as inactive
exports.markInactive = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOneAndUpdate(
      { id },
      { status: false },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};