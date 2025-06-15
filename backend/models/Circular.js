const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  name: String,
  path: String,
  size: Number
});

const circularSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  recipientGroups: [{ type: String, enum: ['students', 'faculty'] }],
  selectedDepartments: [{ type: String }],
  attachments: [attachmentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Circular', circularSchema);
