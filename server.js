/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Himanshi Arora Student ID: 153974233 Date: 26 July 2024 
*
*  Online (vercel) Link: ________________________________________________________
*
********************************************************************************/ 

var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData");
var exphbs = require('express-handlebars');
var app = express();

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Setup Handlebars with custom helpers
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

// Middleware to set the active route
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// GET route to return the home.hbs file
app.get("/", (req, res) => {
    res.render("home", { title: 'Home' });
});

// GET route to return the about.hbs file
app.get("/about", (req, res) => {
    res.render("about", { title: 'About' });
});

// GET route to return the htmlDemo.hbs file
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo", { title: 'HTML Demo' });
});

// GET route to return all students or students by course
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course).then((data) => {
            res.render("students", { students: data });
        }).catch((err) => {
            res.render("students", { message: "no results" });
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.render("students", { students: data });
        }).catch((err) => {
            res.render("students", { message: "no results" });
        });
    }
});

// GET route to return all courses
app.get("/courses", (req, res) => {
    collegeData.getCourses().then((data) => {
        res.render("courses", { courses: data });
    }).catch((err) => {
        res.render("courses", { message: "no results" });
    });
});

// GET route to return a specific course by id
app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then((data) => {
            res.render("course", { course: data });
        })
        .catch((err) => {
            res.status(404).render("course", { message: "Course not found" });
        });
});

// GET route to return a student by student number
app.get("/student/:num", (req, res) => {
    let viewData = {};
    collegeData.getStudentByNum(req.params.num)
        .then((data) => {
            if (data) {
                viewData.student = data; // storing student data in viewData
            } else {
                viewData.message = "Student not found"; // setting a message if no student found
            }
        })
        .catch((err) => {
            viewData.message = "Student not found"; // set a message if an error occurs
        })
        .then(() => collegeData.getCourses())
        .then((data) => {
            viewData.courses = data; 
            // render the student view
            res.render("student", { student: viewData.student, courses: viewData.courses });
        })
        .catch((err) => {
            viewData.coursesMessage = "No courses found"; // set a message if an error occurs
            res.render("student", { student: viewData.student, coursesMessage: viewData.coursesMessage });
        });
});

// POST route to update a student
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => {
            console.log("Updated student data:", req.body); // Log the form data to the console
            res.redirect("/students"); // Redirect to the student listing page
        })
        .catch((err) => {
            res.status(500).send("Unable to update student");
        });
});

// GET route to return addStudent.hbs
app.get("/students/add", (req, res) => {
    res.render("addStudent", { title: 'Add Student' });
});

// POST route to handle form submission for adding a student
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect("/students"); // Redirectong to the student listing page
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.sendStatus(500); // Internal server error if something goes wrong
        });
});

// Handling 404 errors
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Initializing the data and start the server
collegeData.initialize().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
}).catch((err) => {
    console.error("Unable to start server:", err.message);
});
