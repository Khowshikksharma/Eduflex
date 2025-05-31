const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student routes
router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.patch('/:id/inactive', studentController.markInactive);

module.exports = router;