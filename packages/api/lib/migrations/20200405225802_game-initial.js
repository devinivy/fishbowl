'use strict';

exports.up = async (knex) => {

    await knex.schema
        .createTable('Games', (t) => {

            t.string('id').primary();
            t.datetime('createdAt').notNullable();
            t.text('state').notNullable();
        });
};

exports.down = async (knex) => {

    await knex.schema.dropTable('Games');
};
