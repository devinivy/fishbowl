'use strict';

exports.up = async (knex) => {

    await knex.schema
        .table('Games', (t) => {

            t.integer('version')
                .unsigned()
                .notNullable()
                .defaultsTo(0);
        });
};

exports.down = async (knex) => {

    await knex.schema
        .table('Games', (t) => {

            t.dropColumn('version');
        });
};
