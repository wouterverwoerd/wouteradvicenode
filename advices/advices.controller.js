const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const adviceService = require('./advice.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions

function getAll(req, res, next) {
    adviceService.getAll()
        .then(advices => res.json(advices))
        .catch(next);
}

function getById(req, res, next) {
    adviceService.getById(req.params.id)
        .then(advice => res.json(advice))
        .catch(next);
}

function create(req, res, next) {
    adviceService.create(req.body)
        .then(() => res.json({ message: 'Advice created' }))
        .catch(next);
}

function update(req, res, next) {
    adviceService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Advice updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    adviceService.delete(req.params.id)
        .then(() => res.json({ message: 'Advice deleted' }))
        .catch(next);
}

// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object({
        content: Joi.string().required(),
        userid: Joi.string().required(),
        touserid: Joi.string().required(),
        filename: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        content: Joi.string().empty(''),
        touserid: Joi.string().empty(''),
        filename: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
