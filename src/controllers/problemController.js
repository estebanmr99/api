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

// Deberia funcionar
export const updateProblem = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_problem($1, $2)',[req.params.uniqueProblemID, req.body.problemComment], function(err,result) {
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
export const getProblemsInfo = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_problems($1)', [req.body.judges, req.body.tags], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}

// Deberia funcionar
export const addTagToProblem = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_tag_problem($1, $2)',[req.body.tags, req.body.problems], function(err,result) {
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
export const removeTagfromProblem = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_tag_problem($1, $2)',[req.body.tags, req.body.problems], function(err,result) {
        done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// DPensar luego - deberia ir en user controller
export const getJudgesAccessTokens = (req, res) => {
    res.status(200).send();
}


// Deberia funcionar
export const syncProblems = (req, res) => {
    var codeChefToken = req.body.codeChefToken;

    var userID = req.user._id;
    var studentsJudgeCodeForces;
    var studentsJudgeCodeChef;
    var studentsJudgeUVA;

    pool.connect(function(err,client,done) {
        if(err){
          console.log("Not able to stablish connection: "+ err);
          res.status(400).send(err);
        }
        try {
            const studentsJudgeCodeForcesResult = await client.query('SELECT * from prc_get_students_judge($1, $2)',[userID, "CodeForces"]);
            const studentsJudgeCodeChefResult = await client.query('SELECT * from prc_get_students_judge($1, $2)',[userID, "CodeChef"]);
            const studentsJudgeUVAResult = await client.query('SELECT * from prc_get_students_judge($1, $2)',[userID, "UVA"]);
    
            studentsJudgeCodeForces = studentsJudgeCodeForcesResult.rows;
            studentsJudgeCodeChef = studentsJudgeCodeChefResult.rows;
            studentsJudgeUVA = studentsJudgeUVAResult.rows;

        } catch (err) {
          console.log(err.stack);
          res.status(400).send(err);
        }
    });

    const [codeForcesResult, codeChefResult, uvaResult] = await Promise.all([codeForcesAPICall(userID, studentsJudgeCodeForces), 
                                                                             codeChefAPICall(userID, studentsJudgeCodeChef), 
                                                                             uvaAPICall(userID, studentsJudgeUVA)]);

    res.status(200).send();
}

  
async function codeForcesAPICall(userID, studentsJudgeCodeForces) {
    console.log('calling');
}

async function codeChefAPICall(userID, studentsJudgeCodeChef) {
    console.log('calling');
}

async function uvaAPICall(userID, studentsJudgeUVA) {
    console.log('calling');
}