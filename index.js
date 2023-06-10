const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

const classes = require("./classes.json");
const teachers = require("./teachers.json");

// middleware
app.use(cors());



app.get("/", (req, res) => {
  res.send("Summer camp is running");
});

app.get("/classes", (req, res) => {
  res.send(classes);
});

app.get('/teachers', (req, res) => {
    res.send(teachers);
})



// popular classes...

app.get("/popularClasses", (req, res) => {
    
    const sortedClasses = classes.languageClasses.sort(
      (a, b) => b.enrolledStudents - a.enrolledStudents
    );
    const popularClasses = sortedClasses.slice(0, 6);
    console.log(popularClasses);
  res.send(popularClasses);
});


// popular teachers...

app.get("/popularTeachers", (req, res) => {

    const sortedTeachers = teachers.teachers.sort(
      (a, b) => b.enrolledStudents - a.enrolledStudents
    );
    const popularTeachers = sortedTeachers.slice(0, 6);
    console.log(popularTeachers);
  res.send(popularTeachers);
});

app.listen(port, () => {
  console.log(`Summer camp running is running on port: ${port}`);
});
