const Faculty = require('../models/Faculty');

const checkFacultyLogin = async (req, res) => {
    try {
        const input = req.body;
        console.log(input);
        const faculty = await Faculty.findOne(input);
        res.json(faculty);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    checkFacultyLogin,
};