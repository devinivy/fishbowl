'use strict';

const Objection = require('objection');
const Schmervice = require('@hapipal/schmervice');

module.exports = Schmervice.withName('db', (app) => ({
    transact: (fn) => Objection.transaction(app.knex(), fn)
}));
