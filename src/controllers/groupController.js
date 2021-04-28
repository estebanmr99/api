import pg from 'pg';
import json2csv from 'json2csv';

// Object created in memory to set the Pool connection with PostgresSQL DB
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
// Function to create a group
// Will recieve in the body:
//                            the group name

export const addGroup = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_add_group($1, $2)', [userID, req.body.groupName], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            var group;
            for (var i = 0; i < result.rows.length; i++) {
                group = result.rows[i];
            }
            // Return the result from the DB with OK (200) status
            res.status(200).send(group);
        });
    });
}

// Falta probar
// Function to delete a group
// Will recieve in the body:
//                            the unique group id

export const deleteGroup = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_delete_group($1, $2)', [userID, req.params.uniqueGroupID], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return with OK (200) status
            res.status(200).send();
        });
    });
}

// Funciona - Yei!
// Function to update a group
// Will recieve in the body:
//                            the unique group id
//                            the new group name

export const updateGroup = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_update_group($1, $2, $3)', [userID, req.params.uniqueGroupID, req.body.groupName], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return with OK (200) status
            res.status(200).send();
        });
    });
}

// Falta probar
// Function to get all the groups with the students information
// Will recieve in the body:
//                            the unique tag ids

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
    },];

    var testGroupsStudents = [{
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id": "3b57e049", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id": "3b57e048", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id": "3b57e047", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id": "3b57e046", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id": "3b57e045", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id": "3b57e044", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    }]

    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(async function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        try {
            // // Execution of a queries directly into the DB with parameters
            // const groupsInfoResult = await client.query('SELECT * from prc_get_groups($1, $2)', [userID, req.body.tags]);
            // const groupsStudentsResult = await client.query('SELECT * from prc_get_groups_students($1, $2)', [userID, req.body.tags]);

            // var groupsInfo = groupsInfoResult.rows;
            // var groupsStudents = groupsStudentsResult.rows;

            // for(var i = 0; i < groupsInfo.length; i++) {
            //     groupsInfo[i]["students"] = groupsStudents.filter(item => item.groupID == groupsInfo[i]["id"]);
            // }

            for (var i = 0; i < testGroups.length; i++) {
                testGroups[i]["students"] = testGroupsStudents.filter(item => item.groupID == testGroups[i]["id"]);
            }

            // Return the result from the DB with OK (200) status
            res.status(200).send(testGroups);
        } catch (err) {
            console.log(err.stack);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
    });
}

// Funciona - Yei!
// Function to retrieve the groups names for the filter

export const getGroupsForFilter = (req, res) => {
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // Execution of a query directly into the DB with parameters
        client.query('SELECT * from prc_get_groups($1, $2)', [userID, ""], function (err, result) {
            done();
            if (err) {
                console.log(err);
                // Return the error with BAD REQUEST (400) status
                res.status(400).send(err);
            }
            // Return the result from the DB with OK (200) status
            res.status(200).send(result.rows);
        });
    });
}

// Falta probar
// Function to export a group information into a CSV file
// Will recieve in the body:
//                            the unique group id

export const exportGroup = (req, res) => {
    var testStudents = [{
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id": "3b57e049", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id": "3b57e048", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id": "3b57e047", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc3", "id": "3b57e046", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc4", "id": "3b57e045", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    },
    {
        "groupID": "3b57e049-a065-4f5b-a20a-43ab92c05fc5", "id": "3b57e044", "name": "student1", "judge1": "user", "judge2": "use2", "judge3": "user3"
    }]
    var userID = req.user._id;
    // Preparing the pool connection to the DB
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Not able to stablish connection: " + err);
            // Return the error with BAD REQUEST (400) status
            res.status(400).send(err);
        }
        // // Execution of a query directly into the DB with parameters
        // client.query('SELECT * from prc_get_group_students($1, $2)', [userID, req.params.uniqueGroupID], function(err, result) {
        //   done(); 
        //   if(err){
        //     console.log(err);
                // // Return the error with BAD REQUEST (400) status
        //     res.status(400).send(err);
        //   }

        //   const csv = json2csv.parse(result.rows);
        //   res.attachment(req.body.groupName + '.csv');
        // // Return the result from the DB with OK (200) status
        //   res.status(200).send(csv);
        // });

        const csv = json2csv.parse(testStudents);
        res.attachment(req.body.groupName + '.csv');
        // Return the result from the DB with OK (200) status
        res.status(200).send(csv);
    });
}