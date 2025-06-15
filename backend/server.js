const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const connectDB = require("./config/db")
const path = require('path')

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const adminRoutes = require("./routes/adminroutes");
const studentRoutes = require("./routes/studentroutes");
const facultyRoutes = require("./routes/facultyroutes");
const landingRoutes = require("./routes/landingroutes");

app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);
app.use("/", landingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 2032;
app.listen(port, () => {
    console.log(`Server is running at the port ${port}`);
});
