import pg from 'pg';
import Parse from 'csv-parse';
import fs from 'fs-extra';
import axios from 'axios';

const config = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE, 
  password: process.env.DATABASE_PASSWORD, 
  port: process.env.DATABASE_PORT, 
  max: process.env.DATABASE_MAX_CONNECTIONS,
  idleTimeoutMillis: process.env.DATABASE_TIME,
};

var pool = new pg.Pool(config);

// Falta de probar
export const addStudent = async (req, res) => {
  var userID = req.user._id;

  var studentUsernames = req.body.judges.split(";");
  var studentJudgeIds = "";
  for (let i = 0; i < studentUsernames.length; i++) {
    if (i == 2){
      const url = 'https://uhunt.onlinejudge.org/api/uname2uid/' + studentUsernames[i];
      const response = await axios.get(url);
      studentJudgeIds += response.data;
    }
    studentJudgeIds += ";";
  }
  studentJudgeIds = studentJudgeIds.slice(0,-1);
  
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_student($1, $2, $3, $4, $5, $6)', [userID, req.body.studentID, req.body.studentName, req.body.studentLastName, req.body.judges, studentJudgeIds], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      var student;
      for(var i = 0; i< result.rows.length; i++){
        student = result.rows[i];
      }
      res.status(200).send(student);
    });
  });
}

// Falta de probar
export const deleteStudent = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_students($1, $2)', [userID, req.body.studentId], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Falta de probar - No funciono
export const updateStudent = async (req, res) => {
  var userID = req.user._id;

  var studentUsernames = req.body.judges.split(";");
  var studentJudgeIds = "";
  for (let i = 0; i < studentUsernames.length; i++) {
    if (i == 2){
      const url = 'https://uhunt.onlinejudge.org/api/uname2uid/' + studentUsernames[i];
      const response = await axios.get(url);
      studentJudgeIds += response.data;
    }
    studentJudgeIds += ";";
  }
  studentJudgeIds = studentJudgeIds.slice(0,-1);

  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_student($1, $2, $3, $4, $5, $6, $7)',[userID, req.params.uniqueStudentID, req.body.studentID, req.body.studentName, req.body.studentLastName, req.body.judges, studentJudgeIds], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Falta probar - falta en DB
export const getStudentsInfo = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_students($1, $2)', [userID, req.body.group], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}

// Falta probar - faltan los dos SPs
export const getStudentProfile = (req, res) => {
  var testStudent =     {
    "id": "3b57e049-a065-4f5b-a20a-43ab92c05fc3",
    "userid": "testStudentID",
    "name": "testName",
    "lastname": "testLastName",
    "judge1" : "pepito",
  };

  var testStudentProblems = [{"id" : "Random", "Judge": "URI"}, {"id" : "Random2", "Judge": "URI2"}]
  var userID = req.user._id;
  pool.connect(async function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    }
    try {
      // const studentInfoResult = await client.query('SELECT * from prc_get_student_info($1, $2)',[userID, req.params.uniqueStudentID])
      // const studentProblemsResult = await client.query('SELECT * from prc_get_student_problem($1, $2)',[userID, req.params.uniqueStudentID])

      // var studentInfo = studentInfoResult.rows;
      // var studentProblems = studentProblemsResult.rows;

      // studentInfo["Problems"] = studentProblems;

      testStudent["Problems"] = testStudentProblems;

      res.status(200).send(testStudent);
    } catch (err) {
      console.log(err.stack);
      res.status(400).send(err);
    }
  });
}

// Falta probar - No funciona
export const addStudentToGroup = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_students_to_groups($1, $2, $3)',[userID, req.body.students, req.body.groups], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Falta probar - No funciona
export const removeStudentfromGroup = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_students_from_groups($1, $2, $3)',[userID, req.body.students, req.body.groups], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Falta probar - No funciona
export const addStudentImported = async (req, res) => {
  var filePath = req.file.path;

  async function onNewRecord(record){
    var studentUsernames = record.jueces.split(";");
    var studentJudgeIds = "";
    for (let i = 0; i < studentUsernames.length; i++) {
      if (i == 2){
        const url = 'https://uhunt.onlinejudge.org/api/uname2uid/' + studentUsernames[i];
        const response = await axios.get(url);
        studentJudgeIds += response.data;
      }
      studentJudgeIds += ";";
    }
    studentJudgeIds = studentJudgeIds.slice(0,-1);  

    var userID = req.user._id;

    pool.connect(function(err,client,done) {
      if(err){
        console.log("Not able to stablish connection: "+ err);
        res.status(400).send(err);
      } 
      client.query('SELECT * from prc_add_student($1, $2, $3, $4, $5, $6)', [userID, record.id, record.nombre, record.apellido, record.jueces, studentJudgeIds], function(err, result) {
        done(); 
        if(err){
          console.log(err);
          //res.status(400).send(err);
        }
        console.log("Student" + record.id + "created successfully");
      });
    });
    console.log(record)
  }

  function onError(error){
    console.log(error)
  }

  function done(linesRead){
    //fs.remove('uploads');
    fs.emptyDir("uploads");
    res.status(200).send();
  }

  var columns = true; 
  parseCSVFile(filePath, columns, onNewRecord, onError, done);
}

function parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done){
  var source = fs.createReadStream(sourceFilePath);
  var linesRead = 0;

  var parser = Parse({
    delimiter: ',', 
    columns:columns
  });

  parser.on("readable", function(){
    var record;
    while (record = parser.read()) {
        linesRead++;
        onNewRecord(record);
    }
  });

  parser.on("error", function(error){
    handleError(error)
  });

  parser.on("end", function(){
    done(linesRead);
  });

  source.pipe(parser);
}