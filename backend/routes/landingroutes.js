const landingController = require('../controllers/landingcontroller');
const express = require('express');
const landingRouter = express.Router();

landingRouter.get("/viewfaculties", landingController.viewfaculties);
landingRouter.get("/viewCourses", landingController.viewCourses);

module.exports = landingRouter;