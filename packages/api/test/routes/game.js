'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Helpers = require('../helpers');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Routes', () => {

    describe('"game"', () => {

        it('fetches a game by id.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { gameService: { create } } = app.services();
            const { id: gameId } = await create();

            const { statusCode, result } = await app.inject(`/games/${gameId}`);

            expect(statusCode).to.equal(200);
            expect(result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(result.id).to.equal(gameId);
        });

        it('fetches a game by id, authenticated.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { db: { transact }, gameService: { create, join } } = app.services();
            const { id: gameId } = await create();

            await transact(join(gameId, { nickname: 'toto' }));

            const { statusCode, result } = await app.inject({
                url: `/games/${gameId}`,
                headers: Helpers.auth(gameId, 'toto')
            });

            expect(statusCode).to.equal(200);
            expect(result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(result.me).to.contain({ nickname: 'toto' });
            expect(result.id).to.equal(gameId);
        });

        it('fetches a game by id, authenticated for a different game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { db: { transact }, gameService: { create, join } } = app.services();
            const { id: gameId } = await create();
            const { id: otherGameId } = await create();

            await transact(join(otherGameId, { nickname: 'toto' }));

            const { statusCode, result } = await app.inject({
                url: `/games/${gameId}`,
                headers: Helpers.auth(otherGameId, 'toto')
            });

            expect(statusCode).to.equal(200);
            expect(result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(result.me).to.not.exist();
            expect(result.id).to.equal(gameId);
        });

        it('404s when a game doesn\'t exist.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { statusCode, result } = await app.inject(`/games/does-not-exist`);

            expect(statusCode).to.equal(404);
            expect(result).to.only.contain(['statusCode', 'error', 'message']);
        });
    });
});
