const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user, role) => {
  return jwt.sign(
    { id: user._id, role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Admin.findOne({ email }) ||
               await Faculty.findOne({ email }) ||
               await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let role;
    if (user instanceof Admin) role = 'admin';
    else if (user instanceof Faculty) role = 'faculty';
    else if (user instanceof Student) role = 'student';

    const token = generateToken(user, role);
    
    user = user.toObject();
    delete user.password;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { ...user, role }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await getUserByIdAndRole(req.user.id, req.user.role);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      user: { ...userObj, role: req.user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function getUserByIdAndRole(id, role) {
  switch (role) {
    case 'admin': return await Admin.findById(id);
    case 'faculty': return await Faculty.findById(id);
    case 'student': return await Student.findById(id);
    default: return null;
  }
}