'use strict';

const Joi = require('joi');

module.exports = {
    method: 'get',
    path: '/timesync',
    options: {
        validate: {
            query: Joi.object({
                id: Joi.alternatives(
                    Joi.string(),
                    Joi.number().integer()
                ).default(null)
            })
        },
        handler: ({ query }) => ({
            id: query.id,
            result: Date.now()
        })
    }
};
