'use strict';

const Objection = require('objection');
const Schmervice = require('schmervice');

module.exports = Schmervice.withName('db', (server) => ({
    transact: (fn) => Objection.transaction(server.knex(), fn)
}));
