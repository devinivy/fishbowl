'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Helpers = require('../helpers');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Routes', () => {

    describe('"game-join"', () => {

        it('joins an existing game, alternating teams.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { gameService: { create } } = app.services();
            const game = await create();

            const results1 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'larry'
                }
            });

            const results2 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'curly'
                }
            });

            const results3 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'moe'
                }
            });

            expect(results1.statusCode).to.equal(200);
            expect(results2.statusCode).to.equal(200);
            expect(results3.statusCode).to.equal(200);

            expect(results1.result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(results2.result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(results3.result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);

            expect(results1.result.id).to.equal(game.id);
            expect(results1.result.status).to.equal('initialized');
            expect(results1.result.me).to.equal({ nickname: 'larry', status: 'not-ready', team: 'a' });
            expect(results1.result.players).to.equal([{ nickname: 'larry', status: 'not-ready', team: 'a' }]);
            expect(results1.result.score).to.equal({ player: { larry: [] }, team: { a: [], b: [] } });

            expect(results2.result.id).to.equal(game.id);
            expect(results2.result.status).to.equal('initialized');
            expect(results2.result.me).to.equal({ nickname: 'curly', status: 'not-ready', team: 'b' });
            expect(results2.result.players).to.equal([
                { nickname: 'larry', status: 'not-ready', team: 'a' },
                { nickname: 'curly', status: 'not-ready', team: 'b' }
            ]);
            expect(results2.result.score).to.equal({ player: { larry: [], curly: [] }, team: { a: [], b: [] } });

            expect(results3.result.id).to.equal(game.id);
            expect(results3.result.status).to.equal('initialized');
            expect(results3.result.me).to.equal({ nickname: 'moe', status: 'not-ready', team: 'a' });
            expect(results3.result.players).to.equal([
                { nickname: 'larry', status: 'not-ready', team: 'a' },
                { nickname: 'curly', status: 'not-ready', team: 'b' },
                { nickname: 'moe', status: 'not-ready', team: 'a' }
            ]);
            expect(results3.result.score).to.equal({ player: { larry: [], curly: [], moe: [] }, team: { a: [], b: [] } });
        });

        it('re-joins an initialized game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { gameService: { create } } = app.services();
            const game = await create();

            const results1 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'toto'
                }
            });

            const results2 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'toto'
                }
            });

            expect(results1.statusCode).to.equal(200);
            expect(results2.statusCode).to.equal(200);

            expect(results1.result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);
            expect(results2.result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);

            expect(results1.result.id).to.equal(game.id);
            expect(results1.result.status).to.equal('initialized');
            expect(results1.result.me).to.equal({ nickname: 'toto', status: 'not-ready', team: 'a' });
            expect(results1.result.players).to.equal([{ nickname: 'toto', status: 'not-ready', team: 'a' }]);
            expect(results1.result.score).to.equal({ player: { toto: [] }, team: { a: [], b: [] } });

            expect(results2.result.id).to.equal(game.id);
            expect(results2.result.status).to.equal('initialized');
            expect(results2.result.me).to.equal({ nickname: 'toto', status: 'not-ready', team: 'a' });
            expect(results2.result.players).to.equal([{ nickname: 'toto', status: 'not-ready', team: 'a' }]);
            expect(results2.result.score).to.equal({ player: { toto: [] }, team: { a: [], b: [] } });
        });

        it('re-joins an in-progress game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const {
                db: { transact },
                gameService: { create, join, playerReady, begin }
            } = app.services();

            let game = await create();
            await transact(join(game.id, { nickname: 'larry' }));
            await transact(playerReady(game.id, {
                nickname: 'larry',
                words: ['1', '2', '3', '4', '5']
            }));
            await transact(join(game.id, { nickname: 'curly' }));
            await transact(playerReady(game.id, {
                nickname: 'curly',
                words: ['1', '2', '3', '4', '5']
            }));
            game = await transact(begin(game.id, null));

            expect(game.state.status).to.equal('in-progress');
            expect(game.state.playerOrder).to.contain('larry');

            const { statusCode, result } = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'larry'
                }
            });

            expect(statusCode).to.equal(200);

            expect(result).to.only.contain(['id', 'version', 'createdAt', 'status', 'me', 'players', 'score', 'turn']);

            expect(result.id).to.equal(game.id);
            expect(result.status).to.equal('in-progress');
            expect(result.me).to.equal({ nickname: 'larry', status: 'ready', team: 'a' });
            expect(result.players).to.equal([
                { nickname: 'larry', status: 'ready', team: 'a' },
                { nickname: 'curly', status: 'ready', team: 'b' }
            ]);
            expect(result.score).to.equal({ player: { larry: [[0]], curly: [[]] }, team: { a: [0], b: [0] } });
        });

        it('400s when missing a nickname in the payload.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { gameService: { create } } = app.services();
            const game = await create();

            const { statusCode, result } = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: null
                }
            });

            expect(statusCode).to.equal(400);
            expect(result).to.only.contain(['statusCode', 'error', 'message']);
        });

        it('409s when newly joining an in-progress game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const {
                db: { transact },
                gameService: { create, join, playerReady, begin }
            } = app.services();

            let game = await create();
            await transact(join(game.id, { nickname: 'larry' }));
            await transact(playerReady(game.id, {
                nickname: 'larry',
                words: ['1', '2', '3', '4', '5']
            }));
            await transact(join(game.id, { nickname: 'curly' }));
            await transact(playerReady(game.id, {
                nickname: 'curly',
                words: ['1', '2', '3', '4', '5']
            }));
            game = await transact(begin(game.id, null));

            expect(game.state.status).to.equal('in-progress');

            const { statusCode, result } = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'moe'
                }
            });

            expect(statusCode).to.equal(409);
            expect(result).to.equal({
                statusCode: 409,
                error: 'Conflict',
                message: 'You cannot newly join a game once it is already in progress.'
            });
        });

        it('409s when joining a finished game.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const {
                db: { transact },
                gameService: { create, join, playerReady, begin, beginTurn, claimWord, end }
            } = app.services();

            let game = await create();
            await transact(join(game.id, { nickname: 'larry' }));
            await transact(playerReady(game.id, {
                nickname: 'larry',
                words: ['1', '2', '3', '4', '5']
            }));
            await transact(join(game.id, { nickname: 'curly' }));
            await transact(playerReady(game.id, {
                nickname: 'curly',
                words: ['1', '2', '3', '4', '5']
            }));
            await transact(begin(game.id, null));
            await transact(beginTurn(game.id, null));
            for (let i = 0; i < 10; ++i) {
                await transact(claimWord(game.id, null));
            }

            game = await transact(end(game.id, null));

            expect(game.state.status).to.equal('finished');

            const results1 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'larry'
                }
            });

            const results2 = await app.inject({
                method: 'post',
                url: `/games/${game.id}/join`,
                payload: {
                    nickname: 'moe'
                }
            });

            expect(results1.statusCode).to.equal(409);
            expect(results2.statusCode).to.equal(409);

            expect(results1.result).to.equal({
                statusCode: 409,
                error: 'Conflict',
                message: 'You can only join a game that is initialized or in progress.'
            });
            expect(results2.result).to.equal({
                statusCode: 409,
                error: 'Conflict',
                message: 'You can only join a game that is initialized or in progress.'
            });
        });

        it('404s when a game doesn\'t exist.', async (flags) => {

            const app = await Helpers.createApp();
            flags.onCleanup = async () => await app.stop();

            const { statusCode, result } = await app.inject({
                method: 'post',
                url: '/games/does-not-exist/join',
                payload: {
                    nickname: 'moe'
                }
            });

            expect(statusCode).to.equal(404);
            expect(result).to.only.contain(['statusCode', 'error', 'message']);
        });
    });
});
