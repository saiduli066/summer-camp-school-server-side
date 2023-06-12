const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const classes = require("./classes.json");
const teachers = require("./teachers.json");
const reviews = require("./reviews.json");

// middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Summer camp is running");
});

app.get("/classes", (req, res) => {
  res.send(classes);
});

app.get("/teachers", (req, res) => {
  res.send(teachers);
});
app.get("/reviews", (req, res) => {
  res.send(reviews);
});

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


// mondoDB

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqivy75.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
   
        const studentsCollection = client.db("schoolDB").collection("students");


// students...
  
      app.get("/students", async (req, res) => {
        const result = await studentsCollection.find().toArray();
        res.send(result);
      });
    
      app.post("/students", async (req, res) => {
        const student = req.body;
        const query = { email: student.email };
        const existingStudent = await studentsCollection.findOne(query);

        if (existingStudent) {
          return res.send({ message: "User already exists" });
        }

        const result = await studentsCollection.insertOne(student);
        res.send(result);
      });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Summer camp running is running on port: ${port}`);
});
