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

// Funciona - Yei!
export const addTag = (req, res) => {
  var userID = req.user._id;
    pool.connect(function(err,client,done) {
        if(err){
            console.log("Not able to stablish connection: "+ err);
            res.status(400).send(err);
        }
        client.query('SELECT * from prc_add_tag($1, $2)', [userID, req.body.tagName], function(err, result) {
            done(); 
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            var tag;
            for(var i = 0; i< result.rows.length; i++){
                tag = result.rows[i];
            }
            res.status(200).send(tag);
        });
    });
}

// Funciona - Yei!
export const deleteTag = (req, res) => {
  var userID = req.user._id;
    pool.connect(function(err,client,done) {
      if(err){
        console.log("Not able to stablish connection: "+ err);
        res.status(400).send(err);
      } 
      client.query('SELECT * from prc_delete_tags($1, $2)', [userID, req.body.uniqueTagID], function(err, result) {
        done(); 
        if(err){
          console.log(err);
          res.status(400).send(err);
        }
        res.status(200).send();
      });
    });
  }

// Funciona - Yei!
export const updateTag = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_tag($1, $2, $3)',[userID, req.params.uniqueTagID, req.body.tagName], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// Funciona - Yei!
export const getTagsInfo = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_tags($1)', [userID], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}

// Funciona - Yei!
export const getTagsNames = (req, res) => {
  var userID = req.user._id;
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_tags_names($1)', [userID], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}