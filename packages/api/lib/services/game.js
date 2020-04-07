'use strict';

const Schmervice = require('schmervice');

module.exports = Schmervice.withName('gameService', (server) => {

    const models = () => server.models();
    const services = () => server.services();

    return {
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
        async join(gameId, { nickname }, txn) {

            const { Game } = models();
            const { gameService } = services();

            const { state } = await gameService.getById(gameId, txn);

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

            const game = await Game.query(txn)
                .patchAndFetchById(gameId, { state })
                .throwIfNotFound();

            return game;
        },
        async playerReady(gameId, { nickname, words }, txn) {

            const { Game } = models();
            const { gameService } = services();

            const { state } = await gameService.getById(gameId, txn);

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

            const game = await Game.query(txn)
                .patchAndFetchById(gameId, { state })
                .throwIfNotFound();

            return game;
        }
    };
});
