const mongoose = require('mongoose');

const facultyCourseMappingSchema = new mongoose.Schema({
    fmapid: { type: String, required: true, unique: true },
    facultyname: { type: String, required: true },
    facultyId: { type: String, required: true },
    ccode: { type: String, required: true },
    cname: { type: String, required: true, trim: true },
    academicYear: { type: String },
    semester: { type: Number },
    departments: [{ type: String, required: true }],
    components: [{
        type: { type: String, enum: ['L', 'T', 'P', 'S'] },
        hours: { type: Number }
    }],
    status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FacultyCourseMapping', facultyCourseMappingSchema);