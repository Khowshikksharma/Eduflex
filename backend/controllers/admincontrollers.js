const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

const checkAdminLogin = async (req, res) => {
    try{
        const input = req.body;
        console.log(input);
        const admin = await Admin.findOne(input);
        res.json(admin)
    }catch(error){
        response.status(500).send(error.message); 
    }
}

module.exports = {
    checkAdminLogin
};