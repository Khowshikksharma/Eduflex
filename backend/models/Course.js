const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    ccode: { type: String, required: true, unique: true },
    cname: { type: String, required: true },
    cshortname: { type: String, required: true },
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    components: { 
        type: [Number], 
        required: true, 
        default: [0, 0, 0, 0], 
        validate: [arr => arr.length === 4, 'components array must have exactly 4 elements']
    },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
    status: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);