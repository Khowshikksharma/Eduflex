const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  salary: { type: Number, required: true },
  qualification: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  aadhaarNo: { type: String, required: true },
  fatherName: { type: String, required: true },
  startYear: { type: Number, required: true },
  status: { type: Boolean, default: true },
  resignedDate: { type: Date,default: null },
  maritalStatus: { type: String, required: true },
  motherTongue: { type: String, required: true },
  nationality: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true } // Added for authentication
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);