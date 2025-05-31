const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Create admin (for initial setup)
exports.createAdmin = async (req, res) => {
  try {
    const { id, name, dob, gender, email, phone, qualification, fatherName, maritalStatus, motherTongue, nationality, address, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      id,
      name,
      dob,
      gender,
      email,
      phone,
      qualification,
      fatherName,
      maritalStatus,
      motherTongue,
      nationality,
      address,
      password: hashedPassword
    });
    
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};