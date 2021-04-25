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

// Falta probar
export const updateProblem = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_problem($1, $2, $3)',[userID, req.params.uniqueProblemID, req.body.problemComment], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Falta probar - Falta el SP en la DB
export const getProblemsInfo = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_problems($1, $2, $3)', [userID, req.body.judges, req.body.tags], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}

// Falta probar
export const addTagToProblem = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_tags_to_problems($1, $2, $3)',[userID, req.body.tags, req.body.problems], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Falta probar
export const removeTagfromProblem = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_tags_from_problems($1, $2, $3)',[userID, req.body.tags, req.body.problems], function(err,result) {
        done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Falta probar - faltan los dos SPs 
export const syncProblems = async (req, res) => {
    //var codeChefToken = req.body.codeChefToken;

    // var userID = req.user._id;
    var userID = "3b57e049-a065-4f5b-a20a-43ab92c05fc3";
    // var studentsJudgeCodeForces;
    // var studentsJudgeCodeChef;
    // var studentsJudgeUVA;

    var studentsJudgeCodeChef = [{ 
                                    "studentId" : "3b57e049", "studentUsername": "joss15"
                                }, 
                                {
                                    "studentId" : "3b57e048", "studentUsername": "estebanmrj99"
                                }]
    var studentsJudgeUVA = [{ 
                                "studentId" : "3b57e049", "studentUserId": "11331"
                            }]
    var studentsJudgeCodeForces = [{ 
                                  "studentId" : "3b57e049", "studentUsername": "nostarck"
                              }, 
                              {
                                  "studentId" : "3b57e048", "studentUsername": "Fefer_Ivan"
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
      problems = problems.slice(0,-1);

      // pool.connect(function(err,client,done) {
      //   if(err){
      //     console.log("Not able to stablish connection: "+ err);
      //   } else {
      //     client.query('SELECT * from prc_update_student_problems($1, $2, $3, $4)',[userID, studentsJudgeCodeForces[i]["studentId"], studentsJudgeCodeForces[i]["studentUsername"], "CodeForces", problems], function(err,result) {
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
        var data = JSON.stringify({"grant_type":"client_credentials","scope":"public","client_id":"ce8dd1716ceb5641237ddb77eaf35615","client_secret":"6a3f2deeca7d06b9f621effe163b5811","redirect_uri":"http://localhost:8000/"});

        const url = 'https://api.codechef.com/oauth/token';
        const headers = {
            headers: { "content-type": "application/json" },
        };
    
        const response = await axios.post(url,data, headers);
        const token = response.data["result"]["data"]["access_token"];

        for (let i = 0; i < studentsJudgeCodeChef.length; i++) {
            const url = 'https://api.codechef.com/users/' + studentsJudgeCodeChef[i]["studentUsername"];
            const options = {
                params: { fields: "problemStats" },
                headers: {  
                            "Accep": "application/json", 
                            "Authorization": "Bearer " + token
                         },
            };
            
            try {
                const response = await axios.get(url, options);
                var studentProblems = response.data["result"]["data"]["content"]["problemStats"]["solved"];
                var problems = "";
    
                for (var key in studentProblems) {
                    problems += studentProblems[key].join(";");
                    if (problems != "")
                        problems += ";";
                }
                problems = problems.slice(0,-1);
        
              // pool.connect(function(err,client,done) {
              //   if(err){
              //     console.log("Not able to stablish connection: "+ err);
              //   } else {
              //     client.query('SELECT * from prc_update_student_problems($1, $2, $3, $4)',[userID, studentsJudgeCodeChef[i]["studentId"], studentsJudgeCodeChef[i]["studentUsername"], "CodeChef", problems], function(err,result) {
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
                  client.query('SELECT * from prc_add_student_log($1, $2, $3)',[userID, studentsJudgeCodeChef[i]["studentUsername"], "CodeChef"], function(err,result) {
                    done(); 
                    if(err)
                      console.log(err);
                  });
                }
              });
            }
            
            var count = i + 1;
            if (count > 1 && count % 30 == 0 ){
              console.log("delay");
              await sleep(300000);
            }
              
        }
    } catch (err) {
        console.log("Couldn't get user token for CodeChef");
    }

}

async function uvaAPICall(userID, studentsJudgeUVA) {
    for (let i = 0; i < studentsJudgeUVA.length; i++) {
        const url = 'https://uhunt.onlinejudge.org/api/subs-user/' + studentsJudgeUVA[i]["studentUserId"];
    
        try {
          const response = await axios.get(url);
          var studentProblems = response.data["subs"].filter(item => item[2] == 90);
          var problems = "";
          for (let j = 0; j < studentProblems.length; j++) {
            problems += studentProblems[j][1] + ";";
          }
    
          // pool.connect(function(err,client,done) {
          //   if(err){
          //     console.log("Not able to stablish connection: "+ err);
          //   } else {
          //     client.query('SELECT * from prc_update_student_problems($1, $2, $3, $4)',[userID, studentsJudgeUVA[i]["studentId"], response.data["uname"], "UVA", problems], function(err,result) {
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
              client.query('SELECT * from prc_add_student_log($1, $2, $3)',[userID, response.data["uname"], "UVA"], function(err,result) {
                done(); 
                if(err)
                  console.log(err);
              });
            }
          });
        }          
    }
}