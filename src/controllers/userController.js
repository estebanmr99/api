import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!"});
  }
}


export const register = (req, res) => {

  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    }
    var hashPassword = bcrypt.hashSync(req.body.password, 10);
    client.query('SELECT * from prc_register_user($1, $2, $3)', [req.body.username, req.body.email, hashPassword], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send({
          message: err
        });
      } else {
        var user = result.rows[0];
        console.log(user);
        return res.json(user);
      }
    });
  });
}


export const login = (req,res) => {

  var username = req.body.username;

  findUserByUsername(username);

  function findUserByUsername(username) {
    pool.connect(function(err,client,done) {
      if(err){
        console.log("Not able to stablish connection: "+ err);
        res.status(400).send(err);
      } 
      client.query('SELECT * from prc_find_user_by_username($1)', [username], function(err, result) {
        done(); 
        if(err){
          console.log(err);
          res.status(400).send(err);
        }

        if (result.rows.length == 0){
          res.status(401).json({ message: 'Authentication failed. No user found'});
        } else {

          var user;
          user = result.rows[0];
          console.log(user);
          if (!comparePassword(req.body.password, user.hash)) {
            res.status(401).json({ message: 'Authentication failed. Wrong password'});
          } else {
            return res.json({token: jwt.sign({username: user.username, _id: user.id}, 'RESTFULAPIs')});
          }
          
        }
      });
    });
  }

  function comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }

}