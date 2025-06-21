const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  qualification: { type: String, required: true },
  fatherName: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  motherTongue: { type: String, required: true },
  nationality: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);