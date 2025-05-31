const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');

// Get all faculty
exports.getAllFaculty = async (req, res) => {
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
    
    const faculty = await Faculty.find(query);
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create faculty
exports.createFaculty = async (req, res) => {
  try {
    const { password, ...facultyData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const faculty = new Faculty({
      ...facultyData,
      password: hashedPassword
    });
    
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findOneAndUpdate({ id }, req.body, { new: true });
    
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark faculty as resigned
exports.markResigned = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findOneAndUpdate(
      { id },
      { status: false, resignedDate: new Date() },
      { new: true }
    );
    
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};