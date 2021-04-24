import pg from 'pg';
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

//here we make our timeout synchronous using Promises
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Deberia funcionar
export const syncProblems = async (req, res) => {
    //var codeChefToken = req.body.codeChefToken;

    // var userID = req.user._id;
    var userID = "3b57e049-a065-4f5b-a20a-43ab92c05fc3";
    // var studentsJudgeCodeForces;
    // var studentsJudgeCodeChef;
    // var studentsJudgeUVA;

    var studentsJudgeCodeChef;
    var studentsJudgeUVA;
    var studentsJudgeCodeForces = [{ 
                                  "studentId" : "3b57e049", "studentUsername": "nostarck"
                              }, 
                              {
                                  "studentId" : "3b57e048", "studentUsername": "Fefer_Ivan"
                              },
                              {
                                  "studentId" : "3b57e047", "studentUsername": "Fefer_Ivan"
                              }, 
                              {
                                  "studentId" : "3b57e046", "studentUsername": "Fefer_Ivan"
                              },
                              {
                                  "studentId" : "3b57e045", "studentUsername": "Fefer_Ivan"
                              }, 
                              {
                                  "studentId" : "3b57e044", "studentUsername": "Fefer_Ivan"
                              }]

    // pool.connect(async function(err,client,done) {
    //     if(err){
    //       console.log("Not able to stablish connection: "+ err);
    //       res.status(400).send(err);
    //     }
    //     try {
    //         const studentsJudgeCodeForcesResult = await client.query('SELECT * from prc_get_students_judge($1, $2)',[userID, "CodeForces"]);
    //         const studentsJudgeCodeChefResult = await client.query('SELECT * from prc_get_students_judge($1, $2)',[userID, "CodeChef"]);
    //         const studentsJudgeUVAResult = await client.query('SELECT * from prc_get_students_judge($1, $2)',[userID, "UVA"]);
    
    //         studentsJudgeCodeForces = studentsJudgeCodeForcesResult.rows;
    //         studentsJudgeCodeChef = studentsJudgeCodeChefResult.rows;
    //         studentsJudgeUVA = studentsJudgeUVAResult.rows;

    //     } catch (err) {
    //       console.log(err.stack);
    //       res.status(400).send(err);
    //     }
    // });

    const [codeForcesResult, codeChefResult, uvaResult] = await Promise.all([codeForcesAPICall(userID, studentsJudgeCodeForces), 
                                                                             codeChefAPICall(userID, studentsJudgeCodeChef), 
                                                                             uvaAPICall(userID, studentsJudgeUVA)]);

    res.status(200).send();
}

async function codeForcesAPICall(userID, studentsJudgeCodeForces) {
  for (let i = 0; i < studentsJudgeCodeForces.length; i++) {
    const url = 'https://codeforces.com/api/user.status';
    const options = {
        params: { handle : studentsJudgeCodeForces[i]["studentUsername"] }
    };

    try {
      const response = await axios.get(url, options);
      var studentProblems = response.data["result"].filter(item => item.verdict == "OK");
      var problems = "";
      for (let j = 0; j < studentProblems.length; j++) {
        problems += studentProblems[j]["problem"]["contestId"] + studentProblems[j]["problem"]["index"] + ";";
      }

      // pool.connect(function(err,client,done) {
      //   if(err){
      //     console.log("Not able to stablish connection: "+ err);
      //   } else {
      //     client.query('SELECT * from prc_update_student_problems($1, $2, $3)',[userID, studentsJudgeCodeForces[i]["studentId"], studentsJudgeCodeForces[i]["studentUsername"], "CodeForces", problems], function(err,result) {
      //       done(); 
      //       if(err)
      //         console.log(err);
      //     });
      //   }
      // });
      console.log(i);
    } catch (err){
      pool.connect(function(err,client,done) {
        if(err){
          console.log("Not able to stablish connection: "+ err);
        } else {
          client.query('SELECT * from prc_add_student_log($1, $2, $3)',[userID, studentsJudgeCodeForces[i]["studentUsername"], "CodeForces"], function(err,result) {
            done(); 
            if(err)
              console.log(err);
          });
        }
      });
    }
    
    var count = i + 1;
    if (count > 1 && count % 5 == 0 ){
      console.log("delay");
      await sleep(1000);
    }
      
  }
}

async function codeChefAPICall(userID, studentsJudgeCodeChef) {
    try {
        const data = JSON.stringify({"grant_type":"client_credentials","scope":"public","client_id":"ce8dd1716ceb5641237ddb77eaf35615","client_secret":"6a3f2deeca7d06b9f621effe163b5811","redirect_uri":"http://localhost:8000/"});
        const url = 'https://api.codechef.com/oauth/token';
        const headers = {
            headers: { "content-type": "application/json" },
        };
    
        const response = await axios.post(url, data, headers);
        console.log(response.data["result"]);
        
    } catch (err) {
        console.log(err);
    }
}

async function uvaAPICall(userID, studentsJudgeUVA) {
  console.log('calling');
}