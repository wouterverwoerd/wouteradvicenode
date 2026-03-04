const fs = require('fs');
const tedious = require('tedious');
//const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

require('dotenv').config();

// const { dbName, dbConfig } = require('config.json');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    // Load the CA certificate file
    const caCert = fs.readFileSync('./ca.pem', 'utf-8');

    const apiUrl = process.env.REACT_APP_API_HOST;
   // console.log('x');
   // console.log(apiUrl);

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

    // const { user, password, database } = config.database;
    // const connection = await mysql.createConnection({ host, port, user, password });
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL database successfully!');

    // create db if it doesn't already exist
    // await ensureDbExists(dbName);

    // connect to db
    const sequelize = new Sequelize(process.env.REACT_APP_API_SEQUALIZE,
        {
            dialect: 'mysql',
            dialectOptions: {
                
            }
        });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.Advice = require('../advices/advice.model')(sequelize);
    db.Event = require('../events/event.model')(sequelize);

    
    //getCombined();
    // db.CombinedEvent = require('../events/combinedEvent.model')(combinedevents);

    // sync all models with database
    await sequelize.sync({ alter: true });
}


