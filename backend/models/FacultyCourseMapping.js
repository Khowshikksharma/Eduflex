const mongoose = require('mongoose');

const facultyCourseMappingSchema = new mongoose.Schema({
    fmapid: { type: String, required: true, unique: true },
    // facultyId: { type: String, required: true },
    // ccode: { type: String, required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    ccode: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    department: { type: String, required: true },
    // year: { type: Number, required: true }
    status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FacultyCourseMapping', facultyCourseMappingSchema);