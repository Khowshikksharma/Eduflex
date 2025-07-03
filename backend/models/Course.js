// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    ccode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        validate: {
            validator: function(v) { return /^[A-Z0-9]{6}$/.test(v); },
            message: props => `${props.value} is not a valid course code! Must be exactly 6 alphanumeric characters.` 
        }
    },
    cname: { type: String, required: true, trim: true },
    cshortname: { type: String, required: true, trim: true, maxlength: 20 },
    academicYear: {
        type: String,
        required: true,
        validate: {
            validator: function(v) { return /^\d{4}-\d{4}$/.test(v); },
            message: props => `${props.value} is not a valid academic year format! Use YYYY-YYYY format.` 
        }
    },
    semester: { type: Number, required: true, min: 1, max: 8 },
    l: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} is not an integer value for L!` 
        }
    },
    t: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} is not an integer value for T!` 
        } 
    },
    p: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
            message: props => `${props.value} is not an integer value for P!` 
        } 
    },
    s: { 
        type: Number, 
        required: true, 
        default: 0, 
        min: 0, 
        max: 6,
        validate: { 
            validator: Number.isInteger,
            message: props => `${props.value} is not an integer value for S!` 
        } 
    },
    credits: { type: Number, required: true, min: 1, max: 6 },
    departments: { 
        type: [String], 
        required: true,
        validate: { 
            validator: function(v) { return v.length > 0; },
            message: 'At least one department must be selected' 
        }, 
        default: [] 
    },
    sections: {
        type: [{
            sectionname: { type: String, required: true },
            sectionstatus: { type: Boolean, default: true }
        }],
        default: function() {
            const sections = [];
            const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            
            this.departments.forEach(dept => {
                sectionLetters.forEach(letter => {
                    sections.push({
                        sectionname: `${dept}-${letter}`,
                        sectionstatus: true
                    });
                });
            });
            
            return sections;
        }
    },
    status: { type: Boolean, default: true }
}, {
    timestamps: true
});

courseSchema.pre('save', function(next) {
    if (this.isModified('departments')) {
        const sectionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const existingSections = this.sections || [];
        const newSections = [];
        const existingSectionsMap = {};
        existingSections.forEach(section => {
            existingSectionsMap[section.sectionname] = section.sectionstatus;
        });
        this.departments.forEach(dept => {
            sectionLetters.forEach(letter => {
                const sectionName = `${dept}-${letter}`;
                newSections.push({
                    sectionname: sectionName,
                    sectionstatus: existingSectionsMap[sectionName] !== undefined 
                        ? existingSectionsMap[sectionName] 
                        : true
                });
            });
        });
        
        this.sections = newSections;
    }
    next();
});

module.exports = mongoose.model('Course', courseSchema);