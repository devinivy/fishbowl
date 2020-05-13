'use strict';

const Confidence = require('confidence');
const Toys = require('toys');
const Schwifty = require('schwifty');

// Glue manifest as a confidence store
module.exports = new Confidence.Store({
    server: {
        host: '0.0.0.0',
        port: {
            $env: 'PORT',
            $coerce: 'number',
            $default: 3000
        },
        debug: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                log: ['error'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: 'fishbowl-api',
                routes: {
                    prefix: '/api'
                }
            },
            {
                plugin: 'fishbowl-frontend'
            },
            {
                plugin: 'schwifty',
                options: {
                    migrateOnStart: true,
                    knex: {
                        client: 'sqlite3',
                        useNullAsDefault: true,     // Suggested for sqlite3
                        connection: {
                            filename: {
                                $env: 'SQLITE_DB_FILE',
                                $default: ':memory:'
                            }
                        },
                        migrations: {
                            stub: Schwifty.migrationsStubPath
                        }
                    }
                }
            },
            {
                plugin: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: 'hpal-debug',
                    production: Toys.noop
                }
            }
        ]
    }
});
