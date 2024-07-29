const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results");
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Ensuring that TA property is set appropriately
        studentData.TA = studentData.TA === undefined ? false : true;

        // Setting the studentNum property
        studentData.studentNum = dataCollection.students.length + 1;

        // Pushing studentData onto the students array
        dataCollection.students.push(studentData);

        // For demonstration, resolving immediately
        resolve();
    });
};

// method to get a course by ID
module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId == id);
        if (course) {
            resolve(course);
        } else {
            reject("query returned 0 results");
        }
    });
};

// method to update student data
module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);
        if (index !== -1) {
            // Ensuring TA property is set appropriately
            studentData.TA = studentData.TA === undefined ? false : true;

            // Updating student data
            dataCollection.students[index] = { ...dataCollection.students[index], ...studentData };
            resolve();
        } else {
            reject("Student not found");
        }
    });
};
