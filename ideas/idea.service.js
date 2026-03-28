const db = require('_helpers/db');
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
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Idea.findAll();
}

async function getById(id) {
    return await getIdea(id);
}

async function create(params) {
    // validate
    if (await db.Idea.findOne({ where: { description: params.description } })) {
        throw 'Content "' + params.content + '" is already registered';
    }

    const idea = new db.Idea(params);
    
    // save idea
    await idea.save();
}

async function update(id, params) {
    const idea = await getIdea(id);

    // validate
    const ideaChanged = params.idea && idea.description !== params.description;
    if (ideaChanged && await db.Idea.findOne({ where: { content: params.description } })) {
        throw 'Content "' + params.description + '" is already registered';
    }

    // copy params to advice and save
    Object.assign(idea, params);
    await idea.save();
}

async function _delete(id) {
    const idea = await getIdea(id);
    await idea.destroy();
}

// helper functions

async function getIdea(id) {
    const idea = await db.Idea.findByPk(id);
    if (!idea) throw 'Idea not found';
    return idea;
}



