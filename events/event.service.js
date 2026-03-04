const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
// const { dbName, database } = require('config.json');
const db = require('_helpers/db');
const tedious = require('tedious');
var statement = "select id, content, filename from Advice";
var innerStatement = "select id, description from Events";
var Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const mysql = require('mysql');
const fs = require('fs');

require('dotenv').config();
const caCert = fs.readFileSync('./ca.pem', 'utf-8');
const connectionConfig = {
    host: process.env.REACT_APP_API_HOST,
    port: process.env.REACT_APP_API_PORT,
    user: process.env.REACT_APP_API_USER,
    password: process.env.REACT_APP_API_PASSWORD,
    database: process.env.REACT_APP_API_DATABASE,
    ssl: true,
    ssl: {
        rejectUnauthorized: false,
        ca: caCert,
    },
};

module.exports = {
    getAll,
    getCombined,
    getCombined2,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Event.findAll();
}

async function getCombined() {
    return await getCombined();
}

async function getCombined2() {
    return await getCombined2();
}

async function getById(id) {
    return await getEvent(id);
}

async function create(params) {
    // validate
    if (await db.Event.findOne({ where: { description: params.description } })) {
        throw 'Content "' + params.content + '" is already registered';
    }

    const event = new db.Event(params);
    
    // hash password
    //user.passwordHash = await bcrypt.hash(params.password, 10);

    // save event
    await event.save();
}

async function update(id, params) {
    const event = await getEvent(id);

    // validate
    const eventChanged = params.event && event.description !== params.description;
    if (eventChanged && await db.Event.findOne({ where: { content: params.description } })) {
        throw 'Content "' + params.description + '" is already registered';
    }

    // copy params to advice and save
    Object.assign(event, params);
    await event.save();
}

async function _delete(id) {
    const event = await getEvent(id);
    await event.destroy();
}

// helper functions

async function getEvent(id) {
    const event = await db.Event.findByPk(id);
    if (!event) throw 'Event not found';
    return event;
}

async function getCombined() {
    const dialect = 'mysql';
    const host = connectionConfig.host;
    // const { userName, password } = { connectionConfig.user, connectionConfig.password };
    const combined = new Sequelize(connectionConfig.database, connectionConfig.user, connectionConfig.password, { host, dialect });
    const { QueryTypes } = require('sequelize');
    combinedevents = await combined.query('select u.firstname, u.lastname, u.email, u.id as userID, a.content, ' +
        ' a.filename, a.id as adviceID, e.description, e.id as eventID, e.eventDate, e.createdAt from advice a inner join users u on u.id = ' +
        ' a.userid inner join events e on a.id = e.adviceid', {
        type: QueryTypes.SELECT,
    });
    return combinedevents;
}

async function fetchData(id) {
    return new Promise(resolve => {
        const dialect = 'mysql';
        const host = database.host;
       // const { userName, password } = database.authentication.options;
        const combined2 = new Sequelize(connectionConfig.database, connectionConfig.user, connectionConfig.password, { host, dialect });
        const { QueryTypes } = require('sequelize');
        setTimeout(resolve, 100, 'foo');
    });
}

function outerQuery(connection, callback) {

    var results = [];
    //console.log("xxx");
    
    connection.query("select id, content, filename from Advice", function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        result.forEach(row => {
            results.push({id: row.id, content: row.content, filename: row.filename });
        });

        connection.end(function (err) {
            if (err) {
                return console.error('error during disconnection: ' + err.message);
            }
            console.log('Connection ended gracefully.');
        });

        //callback with result to ue4
        callback(null, results);
    });
}

function innerQuery(connection, callback) {

    var results = [];
    connection.query(innerStatement, function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        result.forEach(row => {
            results.push({ id: row.id, description: row.description, eventDate: row.eventDate });
        });

        connection.end(function (err) {
            if (err) {
                return console.error('error during disconnection: ' + err.message);
            }
            console.log('Connection ended gracefully.');
        });

        //callback with result to ue4
        callback(null, results);
    });
}

function doInnerQuery() {
    // console.log(0);
    return new Promise(resolve => {
        // console.log(dbConfig);
        // var connection = new Connection(database);

        const connection = mysql.createConnection(connectionConfig);

        var myresults = [];
        connection.on('connect', function (err) {
            if (err) {
                console.error('Connection Error: ', err);
            } else {
                console.log('Successfully connected to MySQL!');
                innerQuery(connection, function (error, results) {
                    // here is the results array from the first query
                    // console.log(results);
                    myresults = results;
                    resolve(myresults);
                });
            }
        });
        connection.connect();
    }).then((message) => {
      //  console.log("Success"); // Executed when the promise resolves
        return message;
    })
        .catch((error) => {
            console.error("Error:", error.message); // Executed if the promise rejects
        })
        .finally(() => {
            console.log("Operation completed (success scenario).\n"); // Executed regardless of resolution or rejection
        });
}

async function getCombined2() {
    var combinedResults = [];
    var outerresults = await doOuterQuery();
 //  console.log(outerresults);
    for (const current of outerresults) {
        var thisvalue = current.id;
        var innerStatement2 = 'select id, description, eventDate from Events where adviceid = ' + String(thisvalue);
       // console.log(innerStatement2);
        innerStatement = innerStatement2;
        var innerresults = await doInnerQuery();
      //  console.log(innerresults);
        var thiscombined = {};
        thiscombined.adviceID = current.id;
        thiscombined.adviceDescription = current.content;
        thiscombined.adviceFilename = current.filename;
        thiscombined.Events = [];
        for (const currentevent of innerresults) {
            var thisEvent = {};
            thisEvent.eventID = currentevent.id;
            thisEvent.eventDescription = currentevent.description;
            thisEvent.eventDate = currentevent.eventDate;
           // console.log(thisEvent);
            thiscombined.Events.push(thisEvent);
        }
        combinedResults.push(thiscombined);
    };
    return combinedResults;
}

async function doOuterQuery() {
    // console.log(0);
    return new Promise(resolve => {
    console.log(connectionConfig);

    const connection = mysql.createConnection(connectionConfig);

    var myresults = [];
    connection.on('connect', function (err) {
        if (err) {
            console.error('Connection Error 1: ', err);
        } else {
                console.log('Successfully connected to MySQL!');
                outerQuery(connection, function (error, results) {
                // here are the results array from the first query
                console.log(results);
                myresults = results;
                resolve(myresults);
            });
        }
    });
    connection.connect();
    }).then((message) => {
//        console.log("Success"); // Executed when the promise resolves
//        console.log(message);
        return message;
    })
        .catch((error) => {
            console.error("Error:", error.message); // Executed if the promise rejects
        })
        .finally(() => {
            console.log("Operation completed (success scenario).\n"); // Executed regardless of resolution or rejection
        });
}