'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Helpers = require('../helpers');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Routes', () => {

    describe('"game-create"', () => {

        it('creates a new game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { gameService: { getById } } = app.services();

            const { statusCode, result } = await app.inject({
                method: 'post',
                url: '/games'
            });

            expect(statusCode).to.equal(200);
            expect(result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(await getById(result.id)).to.exist();
        });
    });
});
