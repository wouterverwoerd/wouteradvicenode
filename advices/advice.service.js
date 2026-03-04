const bcrypt = require('bcryptjs');

const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Advice.findAll();
}

async function getById(id) {
    return await getAdvice(id);
}

async function create(params) {
    // validate
    if (await db.Advice.findOne({ where: { content: params.content } })) {
        throw 'Cotent "' + params.content + '" is already registered';
    }

    const advice = new db.Advice(params);
    
    // hash password
    //user.passwordHash = await bcrypt.hash(params.password, 10);

    // save advice
    await advice.save();
}

async function update(id, params) {
    const advice = await getAdvice(id);

    // validate
    const adviceChanged = params.advice && advice.content !== params.content;
    if (adviceChanged && await db.Advice.findOne({ where: { content: params.content } })) {
        throw 'Content "' + params.content + '" is already registered';
    }

    // copy params to advice and save
    Object.assign(advice, params);
    await advice.save();
}

async function _delete(id) {
    const advice = await getAdvice(id);
    await advice.destroy();
}

// helper functions

async function getAdvice(id) {
    const advice = await db.Advice.findByPk(id);
    if (!advice) throw 'Advice not found';
    return advice;
}
