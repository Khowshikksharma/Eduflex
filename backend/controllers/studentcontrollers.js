const Student = require('../models/Student');

const checkStudentLogin = async (req, res) => {
    try {
        const input = req.body;
        console.log(input);
        const student = await Student.findOne(input);
        res.json(student);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    checkStudentLogin,   
};