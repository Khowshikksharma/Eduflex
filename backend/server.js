const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const dburl = process.env.MONGO_URL;
mongoose.connect(dburl).then(async () => {
    console.log("Connected to DB Successfully");
  }).catch((e) => {
    console.log(e.message);
});

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

const port = process.env.PORT || 2032;
app.listen(port, () => {
    console.log(`Server is running at the port ${port}`);
});
