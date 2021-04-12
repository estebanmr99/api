import pg from 'pg';

const config = {
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE, 
  password: process.env.DATABASE_PASSWORD, 
  port: process.env.DATABASE_PORT, 
  max: process.env.DATABASE_MAX_CONNECTIONS,
  idleTimeoutMillis: process.env.DATABASE_TIME,
};

var pool = new pg.Pool(config);

// si funciona
export const addStudent = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_student($1, $2, $3, $4)', [req.body.studentID, req.body.studentName, req.body.studentLastName, req.body.judges], function(err, result) {
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

// si funciona
export const deleteStudent = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_students($1)', [req.body.student], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// si funciona
export const updateStudent = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_student($1, $2, $3, $4)',[req.params.uniqueStudentID, req.body.studentID, req.body.studentName, req.body.judges] ,function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// si funciona
export const getStudentsInfo = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_students($1)', [req.body.group], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}

// Funciona  ------------ hay que aclarar cosas del SP para el manejo de etiquetas o grupos
export const getStudentProfile = (req, res) => {
  var testStudent =     {
    "id": "3b57e049-a065-4f5b-a20a-43ab92c05fc3",
    "userid": "testStudentID",
    "name": "testName",
    "lastname": "testLastName"
  };

  var testStudentProblems = [{"id" : "Random", "Judge": "URI"}, {"id" : "Random2", "Judge": "URI2"}]

  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    }
    try {
      // const studentInfoResult = await client.query('SELECT * from prc_get_student_info($1)',[req.params.uniqueStudentID])
      // const studentProblemsResult = await client.query('SELECT * from prc_get_student_problem($1)',[req.params.uniqueStudentID])

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

// Deberia funcionar
export const addStudentToGroup = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_student_group($1, $2)',[req.body.students, req.body.groups] ,function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Deberia funcionar
export const removeStudentfromGroup = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_student_group($1, $2)',[req.body.students, req.body.groups] ,function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// -----------------------------------------------------FALTA
export const addStudentImported = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_seleccionar_usuario($1)',[req.params.userId] ,function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      var user;
      for(var i = 0; i< result.rows.length; i++){
        user = result.rows[i];
      }
      res.status(200).send(user);
    });
  });
}