import pg from 'pg';
import Parse from 'csv-parse';
import fs from 'fs-extra';
import axios from 'axios';

// Object created in memory to set the Pool connection with PostgresSQL DB
const config = {
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    max: process.env.DATABASE_MAX_CONNECTIONS,
    idleTimeoutMillis: process.env.DATABASE_TIME,
};

var pool = new pg.Pool(config);

// Funciona - Yei!
// Function to create a student
// Will recieve in the body:
//                            the student id
//                            the student name
//                            the student lastname
//                            the student usernames for the judges

export const addStudent = async (req, res) => {
    var userID = req.user._id;

    var studentUsernames = req.body.judges.split(";");
    var studentJudgeIds = "";
    for (let i = 0; i < studentUsernames.length; i++) {
        if (i == 2 && studentUsernames[i] != "") {
            const url = process.env.UVA_GET_ID + studentUsernames[i];
            const response = await axios.get(url);
            studentJudgeIds += response.data;
        }
        studentJudgeIds += ";";
    }
    studentJudgeIds = studentJudgeIds.slice(0, -1);
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_add_student($1, $2, $3, $4, $5, $6)', [userID, req.body.studentID, req.body.studentName, req.body.studentLastName, req.body.judges, studentJudgeIds], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            var student;
            for (var i = 0; i < result.rows.length; i++) {
                student = result.rows[i];
            }
            // Return the result from the DB with OK (200) status
            res.status(200).send(student);
        });
    });
}

// Falta de probar
// Function to delete a student
// Will recieve in the body:
//                            the student unique id

export const deleteStudent = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_delete_students($1, $2)', [userID, req.body.studentId], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return with OK (200) status
            res.status(200).send();
        });
    });
}

// Funciona - Yei!
// Function to update a student
// Will recieve in the body:
//                            the student unique id
//                            the student id
//                            the student name
//                            the student lastname
//                            the student usernames for the judges

export const updateStudent = async (req, res) => {
    var userID = req.user._id;

    var studentUsernames = req.body.judges.split(";");
    var studentJudgeIds = "";
    for (let i = 0; i < studentUsernames.length; i++) {
        if (i == 2 && studentUsernames[i] != "") {
            const url = process.env.UVA_GET_ID + studentUsernames[i];
            const response = await axios.get(url);
            studentJudgeIds += response.data;
        }
        studentJudgeIds += ";";
    }
    studentJudgeIds = studentJudgeIds.slice(0, -1);
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_update_student($1, $2, $3, $4, $5, $6, $7)', [userID, req.params.uniqueStudentID, req.body.studentID, req.body.studentName, req.body.studentLastName, req.body.judges, studentJudgeIds], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return with OK (200) status
            res.status(200).send();
        });
    });
}

// Falta probar - falta en DB
// Function to get all the students based on the user id
// Will recieve in the body:
//                            the group unique id (if it's necessary to filter)

export const getStudentsInfo = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_get_students($1, $2)', [userID, req.body.group], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return the result from the DB with OK (200) status
            res.status(200).send(result.rows);
        });
    });
}

// Falta probar - faltan los dos SPs
// Function to student profile information
// Will recieve in the body:
//                            the unique student id

export const getStudentProfile = (req, res) => {
    var testStudent = {
        "id": "3b57e049-a065-4f5b-a20a-43ab92c05fc3",
        "userid": "testStudentID",
        "name": "testName",
        "lastname": "testLastName",
    };

    var testStudentProblems = [{ "id": "Random", "Judge": "URI" }, { "id": "Random2", "Judge": "URI2" }];
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(async function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        try {
            // Execution of a queries directly into the DB with parameters
            // const studentInfoResult = await client.query('SELECT * from prc_get_student_info($1, $2)',[userID, req.params.uniqueStudentID])
            // const studentJudgesResult = await client.query('SELECT * from prc_get_student_usernames($1, $2)',[userID, req.params.uniqueStudentID])
            // const studentProblemsResult = await client.query('SELECT * from prc_get_student_problem($1, $2)',[userID, req.params.uniqueStudentID])

            // var studentInfo = studentInfoResult.rows;
            // var studentJudges = studentJudgesResult.rows;
            // var studentProblems = studentProblemsResult.rows;

            // studentInfo["Judges"] = studentJudges;
            // studentInfo["Problems"] = studentProblems;

            testStudent["Problems"] = testStudentProblems;

            // Return the result from the DB with OK (200) status
            res.status(200).send(testStudent);
        } catch (err) {
            console.log(err.stack);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
    });
}

// Falta probar - No funciona
// Function to add a single or multiple students to a single multiple groups 
// Will recieve in the body:
//                            the unique student ids
//                            the unique group id

export const addStudentToGroup = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_add_students_to_groups($1, $2, $3)', [userID, req.body.students, req.body.groups], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return the result from the DB with OK (200) status
            res.status(200).send();
        });
    });
}

// Falta probar - No funciona
// Function to remove a single or multiple students from a single multiple groups 
// Will recieve in the body:
//                            the unique student ids
//                            the unique group id

export const removeStudentfromGroup = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_delete_students_from_groups($1, $2, $3)', [userID, req.body.students, req.body.groups], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return the result from the DB with OK (200) status
            res.status(200).send();
        });
    });
}

// Falta probar - No funciona
// Function to create a single or multiple students from a CSV file
// Will recieve in the file:
//                            the student id
//                            the student name
//                            the student lastname
//                            the student usernames for the judges (Separated by a semicolon)

export const addStudentImported = async (req, res) => {
    var filePath = req.file.path;

    //  Internal function triggered once a line of the CSV file has been read

    async function onNewRecord(record) {
        var studentUsernames = record.jueces.split(";");
        var studentJudgeIds = "";
        for (let i = 0; i < studentUsernames.length; i++) {
            if (i == 2 && studentUsernames[i] != "") {
                const url = process.env.UVA_GET_ID + studentUsernames[i];
                const response = await axios.get(url);
                studentJudgeIds += response.data;
            }
            studentJudgeIds += ";";
        }
        studentJudgeIds = studentJudgeIds.slice(0, -1);

        var userID = req.user._id;
        // Preparing the pool connection to the DB
        pool.connect(function (err, client, done) {
            if (err) {
                console.log("Not able to stablish connection: " + err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Execution of a query directly into the DB with parameters 
            client.query('SELECT * from prc_add_student($1, $2, $3, $4, $5, $6)', [userID, record.id, record.nombre, record.apellido, record.jueces, studentJudgeIds], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    // Return the error with BAD REQUEST (400) status
                    res.status(400).send(err);
                }
                console.log("Student" + record.id + "created successfully");
            });
        });
        console.log(record)
    }

    //  Internal function triggered if there was an error reading the file

    function onError(error) {
        console.log(error)
    }

    //  Internal function triggered when the file has been read completely

    function done(linesRead) {
        fs.emptyDir("uploads");
        // Return with OK (200) status
        res.status(200).send();
    }

    var columns = true;
    parseCSVFile(filePath, columns, onNewRecord, onError, done);
}

//  Internal function to read a CSV file with the path of the file and callbacks as parameters

function parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done) {
    var source = fs.createReadStream(sourceFilePath);
    var linesRead = 0;

    var parser = Parse({
        delimiter: ',',
        columns: columns
    });

    parser.on("readable", function () {
        var record;
        while (record = parser.read()) {
            linesRead++;
            onNewRecord(record);
        }
    });

    parser.on("error", function (error) {
        handleError(error)
    });

    parser.on("end", function () {
        done(linesRead);
    });

    source.pipe(parser);
}