const Faculty = require('../models/Faculty');
const Course = require('../models/Course');

const viewfaculties = async(request,response) =>{
    try {
        const faculties = await Faculty.find();
        if(faculties.length==0){
        response.send("DATA NOT FOUND");
        }
        else{
        response.json(faculties);
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
};

const viewCourses = async (request, response) => {
    try {
        const courses = await Course.find();
        if(courses.length == 0) {
            response.send("No courses found");
        } else {
            response.json(courses);
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
};

module.exports = {
    viewfaculties,
    viewCourses
};
