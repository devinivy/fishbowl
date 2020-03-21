'use strict';

exports.up = async (knex) => {

    await knex.schema.createTable('Counters', (table) => {

        table.increments();
        table.integer('count').unsigned();
    });
};

exports.down = async (knex) => {

    await knex.schema.dropTable('Counters');
};
