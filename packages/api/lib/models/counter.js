'use strict';

const Schwifty = require('schwifty');
const Joi = require('@hapi/joi');

module.exports = class Counter extends Schwifty.Model {

    static get tableName() {

        return 'Counters';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().min(0),
            count: Joi.number().integer().min(0).required()
        });
    }
};
