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

export const deleteStudent = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_student($1)', [req.params.uniqueStudentID], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

export const updateStudent = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_student($1, $2, $3)',[req.params.uniqueStudentID, req.body.studentID, req.body.studentName, req.body.judges] ,function(err,result) {
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
export const getStudentsInfo = (req, res) => {
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

// -----------------------------------------------------FALTA
export const getStudentProfile = (req, res) => {
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

// -----------------------------------------------------FALTA
export const addStudentToGroup = (req, res) => {
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

// -----------------------------------------------------FALTA
export const removeStudentfromGroup = (req, res) => {
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