import pg from 'pg';
import json2csv from 'json2csv';

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
export const addGroup = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_add_group($1)', [req.body.groupName], function(err, result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      var group;
      for(var i = 0; i< result.rows.length; i++){
        group = result.rows[i];
      }
      res.status(200).send(group);
    });
  });
}

// si funciona
export const deleteGroup = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_delete_group($1)', [req.params.uniqueGroupID], function(err, result) {
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
export const updateGroup = (req, res) => {
  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    } 
    client.query('SELECT * from prc_update_student($1, $2)',[req.params.uniqueGroupID, req.body.groupName], function(err,result) {
      done(); 
      if(err){
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send();
    });
  });
}

// deberia funcionar
export const getGroupsInfo = (req, res) => {
  var testGroups = [{
                        "id": "3b57e049-a065-4f5b-a20a-43ab92c05fc3",
                        "name": "Group1",
                    }, 
                    {
                        "id": "3b57e049-a065-4f5b-a20a-43ab92c05fc4",
                        "name": "Group2",
                    },
                    {
                        "id": "3b57e049-a065-4f5b-a20a-43ab92c05fc5",
                        "name": "Group3",
                    },    ];

  var testGroupsStudents = [{
                                "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id" : "3b57e049", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
                            }, 
                            {
                                "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id" : "3b57e048", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
                            },
                            {
                                "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id" : "3b57e047", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
                            }, 
                            {
                                "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id" : "3b57e046", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
                            },
                            {
                                "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id" : "3b57e045", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
                            }, 
                            {
                                "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id" : "3b57e044", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
                            }]

  pool.connect(function(err,client,done) {
    if(err){
      console.log("Not able to stablish connection: "+ err);
      res.status(400).send(err);
    }
    try {
        // const groupsInfoResult = await client.query('SELECT * from prc_get_groups($1)',[req.body.tags]);
        // const groupsStudentsResult = await client.query('SELECT * from prc_get_groups_students($1)',[req.body.tags]);

        // var groupsInfo = groupsInfoResult.rows;
        // var groupsStudents = groupsStudentsResult.rows;

        // for(var i = 0; i < groupsInfo.length; i++) {
        //     groupsInfo[i]["students"] = groupsStudents.filter(item => item.groupID == groupsInfo[i]["id"]);
        // }

        for(var i = 0; i < testGroups.length; i++) {
            testGroups[i]["students"] = testGroupsStudents.filter(item => item.groupID == testGroups[i]["id"]);
        }

      res.status(200).send(testGroups);
    } catch (err) {
      console.log(err.stack);
      res.status(400).send(err);
    }
  });
}

// si funciona
export const getGroupsForFilter = (req, res) => {
    pool.connect(function(err,client,done) {
      if(err){
        console.log("Not able to stablish connection: "+ err);
        res.status(400).send(err);
      } 
      client.query('SELECT * from prc_get_groups()', [], function(err, result) {
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
export const exportGroup = (req, res) => {
    var testStudents = [{
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id" : "3b57e049", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
    }, 
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id" : "3b57e048", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id" : "3b57e047", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
    }, 
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id" : "3b57e046", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id" : "3b57e045", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
    }, 
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id" : "3b57e044", "name": "student1", "judge1" : "user", "judge2" : "use2", "judge3" : "user3"
    }]
    pool.connect(function(err,client,done) {
        if(err){
          console.log("Not able to stablish connection: "+ err);
          res.status(400).send(err);
        } 
        // client.query('SELECT * from prc_get_group_students($1)', [req.params.uniqueGroupID], function(err, result) {
        //   done(); 
        //   if(err){
        //     console.log(err);
        //     res.status(400).send(err);
        //   }

        //   const csv = json2csv.parse(result.rows);
        //   res.attachment(req.body.groupName + '.csv');
        //   res.status(200).send(csv);
        // });

          const csv = json2csv.parse(testStudents);
          res.attachment(req.body.groupName + '.csv');
          res.status(200).send(csv);
      });
}