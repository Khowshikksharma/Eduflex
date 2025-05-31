const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

// Faculty routes
router.get('/', facultyController.getAllFaculty);
router.post('/', facultyController.createFaculty);
router.put('/:id', facultyController.updateFaculty);
router.patch('/:id/resign', facultyController.markResigned);

module.exports = router;