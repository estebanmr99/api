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

export const addTag = (req, res) => {
    pool.connect(function(err,client,done) {
        if(err){
            console.log("Not able to stablish connection: "+ err);
            res.status(400).send(err);
        }
        client.query('SELECT * from prc_add_tag($1)', [req.body.tagName], function(err, result) {
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

export const deleteTag = (req, res) => {
    pool.connect(function(err,client,done) {
      if(err){
        console.log("Not able to stablish connection: "+ err);
        res.status(400).send(err);
      } 
      client.query('SELECT * from prc_delete_tags($1)', [req.body.tag], function(err, result) {
        done(); 
        if(err){
          console.log(err);
          res.status(400).send(err);
        }
        res.status(200).send();
      });
    });
  }

export const updateTag = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_tag($1, $2)',[req.params.uniqueTagID, req.body.tagName], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

export const getTagsInfo = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_tags()', function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}

//falta SP, hacerlo cuando Joss pase los de ella
export const getTagsNames = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_get_tags_names()', function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    });
  });
}