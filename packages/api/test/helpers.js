'use strict';

const Ahem = require('ahem');
const Schwifty = require('schwifty');
const FishbowlAPI = require('..');

exports.createApp = async () => {

    return await Ahem.instance(FishbowlAPI, {}, {
        register: {
            plugin: Schwifty,
            options: {
                migrateOnStart: true,
                knex: {
                    client: 'sqlite3',
                    useNullAsDefault: true,
                    connection: {
                        filename: ':memory:'
                    }
                }
            }
        }
    });
};

exports.auth = (gameId, nickname) => ({
    authorization: 'Basic ' + Buffer.from(`${nickname}:${gameId}`).toString('base64')
});
