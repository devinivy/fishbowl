'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Helpers = require('../helpers');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Routes', () => {

    describe('"games"', () => {

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        it('fetches all games, ordered by creation date.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { gameService: { create } } = app.services();

            const game1 = await create();
            await wait(1);
            const game2 = await create();
            await wait(1);
            const game3 = await create();
            await wait(1);
            const game4 = await create();

            const { statusCode, result } = await app.inject('/games');

            expect(statusCode).to.equal(200);
            expect(result).to.be.an.array();
            expect(result).to.have.length(4);
            result.forEach((game) => {

                expect(game).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            });
            expect(result.map(({ id }) => id)).to.equal([game4.id, game3.id, game2.id, game1.id]);
        });

        it('fetches all games, authenticated for a game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { db: { transact }, gameService: { create, join } } = app.services();

            const game1 = await create();
            const game2 = await create();

            await transact(join(game2.id, { nickname: 'toto' }));

            const { statusCode, result } = await app.inject({
                url: '/games',
                headers: Helpers.auth(game2.id, 'toto')
            });

            expect(statusCode).to.equal(200);
            expect(result).to.be.an.array();
            expect(result).to.have.length(2);

            const byId = (id) => result.find((game) => id === game.id);

            expect(byId(game1.id)).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(byId(game1.id).me).to.not.exist();
            expect(byId(game2.id)).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(byId(game2.id).me).to.contain({ nickname: 'toto' });
        });
    });
});
