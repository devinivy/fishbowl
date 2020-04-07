'use strict';

const Schmervice = require('schmervice');

module.exports = Schmervice.withName('gameService', (server) => {

    const models = () => server.models();
    const services = () => server.services();

    server.event('game-updated');

    const mutation = (mutate) => {

        return async (gameId, opts, txn) => {

            const { Game } = models();
            const { gameService } = services();

            const game = await gameService.getById(gameId, txn);

            const updatedGame = await Game.query(txn)
                .patchAndFetchById(gameId, mutate(game, opts) || game)
                .throwIfNotFound();

            server.events.emit('game-updated', updatedGame);

            return updatedGame;
        };
    };

    return {
        async getAll(txn) {

            const { Game } = models();

            return await Game.query(txn).orderBy('createdAt', 'desc');
        },
        async getById(gameId, txn) {

            const { Game } = models();

            return await Game.query(txn)
                .findById(gameId)
                .throwIfNotFound();
        },
        async create(txn) {

            const { Game } = models();

            const game = await Game.query(txn).insert({
                state: {
                    status: 'initialized',
                    words: [],
                    players: {},
                    playerOrder: [],
                    turn: null,
                    score: {
                        team: {
                            a: [],
                            b: []
                        },
                        player: {}
                    }
                }
            });

            return game;
        },
        join: mutation(({ state }, { nickname }) => {

            if (state.status !== 'initialized') {
                throw new Error();
            }

            if (state.players[nickname]) {
                throw new Error();
            }

            const mostRecentPlayer = state.playerOrder[state.playerOrder.length - 1];
            const mostRecentTeam = mostRecentPlayer ? state.players[mostRecentPlayer].team : 'b';
            const team = mostRecentTeam === 'a' ? 'b' : 'a';

            state.players[nickname] = { nickname, team, status: 'not-ready' };
            state.playerOrder.push(nickname);
            state.score.player[nickname] = [];
        }),
        playerReady: mutation(({ state }, { nickname, words }) => {

            if (state.status !== 'initialized') {
                throw new Error();
            }

            const player = state.players[nickname];

            if (!player || player.status !== 'not-ready') {
                throw new Error();
            }

            if (!words || words.length !== 5) {
                throw new Error();
            }

            state.players[nickname] = { ...player, status: 'ready' };
            state.words.push(...words);
        }),
        present(game, nickname) {

            const { id, createdAt, state: { status, players, playerOrder, score } } = game;

            return {
                id,
                createdAt,
                status,
                me: players[nickname] || null,
                players: playerOrder.map((nick) => players[nick]),
                score,
                turn: null  // TODO
            };
        }
    };
});
