const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: {type: String,required: true,unique: true,default: function() { return generateStudentId(this.department, this.startYear)}},
  name: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  fatherName: { type: String, required: true },
  aadhaarNo: { type: String, required: true },
  semesterFee: { type: Number, required: true },
  qualification: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  status: { type: Boolean, default: true },
  currentYear: { type: String, required: true },
  currentSemester: { type: String, required: true },
  department: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  motherTongue: { type: String, required: true },
  nationality: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true, default: "123" }
}, { timestamps: true });

const generateStudentId = (department, startYear) => {
  const currentYearLastTwoDigits = String(startYear).slice(-2);
  const deptCode = department.length === 2 ? `0${department}` : department;
  const randomNumber = Math.floor(Math.random() * 50000) + 1;
  const serialNumber = String(randomNumber).padStart(5, '0');
  return `${currentYearLastTwoDigits}${deptCode}${serialNumber}`;
};

module.exports = mongoose.model('Student', studentSchema);
