import Joi from 'joi';

const create = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
});

const get = Joi.object({
    id: Joi.string(),
});

const getManyQuery = Joi.object({
    title: Joi.string().optional(),
    body: Joi.string().optional(),
});

export default { create, get, getManyQuery };
