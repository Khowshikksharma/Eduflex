const mongoose = require('mongoose');
const { setMaxListeners } = require('./Admin');

const courseSchema = new mongoose.Schema({
    ccode:{ type: String, required: true, unique: true },
    cname: { type: String, required: true },
    cshortname: { type: String, required: true },
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
    status: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);