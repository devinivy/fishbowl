'use strict';

const Boom = require('@hapi/boom');
const Curry = require('curry');
const Schmervice = require('schmervice');
const { constant: O } = require('patchinko');

const internals = {};

module.exports = Schmervice.withName('gameService', (server) => {

    const models = () => server.models();
    const services = () => server.services();
    const emit = (...args) => server.events.emit(...args);

    server.event('game-updated');

    const mutation = (mutate) => {

        return Curry(async (gameId, opts, txn) => {

            const { Game } = models();
            const { gameService } = services();

            const game = await gameService.getById(gameId, txn);

            const updatedGame = await Game.query(txn)
                .patchAndFetchById(gameId, mutate(game, opts) || game)
                .throwIfNotFound();

            emit('game-updated', updatedGame);

            return updatedGame;
        });
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
        join: mutation((game, { nickname }) => {

            const { state } = game;
            const { gameService: { hasPlayer } } = services();

            if (state.status !== 'initialized' && state.status !== 'in-progress') {
                throw Boom.conflict('You can only join a game that is initialized or in progress.');
            }

            if (state.status === 'in-progress' && !hasPlayer(game, nickname)) {
                throw Boom.conflict('You cannot newly join a game once it is already in progress.');
            }

            if (hasPlayer(game, nickname)) {
                return;
            }

            const mostRecentPlayer = state.playerOrder[state.playerOrder.length - 1];
            const mostRecentTeam = mostRecentPlayer ? state.players[mostRecentPlayer].team : 'b';
            const team = mostRecentTeam === 'a' ? 'b' : 'a';

            O(state, {
                players: O({
                    [nickname]: { nickname, team, status: 'not-ready' }
                }),
                playerOrder: O((x) => [...x, nickname]),
                score: O({
                    player: O({
                        [nickname]: []
                    })
                })
            });
        }),
        playerReady: mutation(({ state }, { nickname, words }) => {

            if (state.status !== 'initialized') {
                throw Boom.conflict('A player can become ready only in an initialized game.');
            }

            const player = state.players[nickname];

            if (!player || player.status !== 'not-ready') {
                throw Boom.conflict('The player has not joined yet or is already ready.');
            }

            if (!words || !words.length) {
                throw Boom.conflict('The player must provide some words in order to become ready.');
            }

            O(state, {
                players: O({
                    [nickname]: O({ status: 'ready' })
                }),
                words: O((x) => [...x, ...words])
            });
        }),
        begin: mutation(({ state }, _) => {

            if (state.status !== 'initialized') {
                throw Boom.conflict('You can only begin a game that is initialized.');
            }

            const players = Object.values(state.players);
            const playerIsReady = ({ status }) => status === 'ready';

            if (players.length < 2 || !players.every(playerIsReady)) {
                throw Boom.conflict('Cannot begin the game because their aren\'t enough players or not every player is ready.');
            }

            const [firstPlayer] = state.playerOrder;

            O(state, {
                status: 'in-progress',
                turn: {
                    status: 'initialized',
                    round: 0,
                    go: 0,
                    roundWords: state.words,
                    player: firstPlayer,
                    lastPlayer: null,
                    word: null,
                    lastWord: null,
                    start: null,
                    end: null
                },
                score: O({
                    team: O({
                        a: O((x) => [...x, 0]),
                        b: O((x) => [...x, 0])
                    }),
                    player: O((x) => {

                        return O(x, ...Object.entries(x).map(([nickname, scores]) => ({
                            [nickname]: [
                                ...scores,
                                nickname === firstPlayer ? [0] : []
                            ]
                        })));
                    })
                })
            });
        }),
        end: mutation(({ state }, _) => {

            if (!state.turn ||
                state.turn.round === 0 ||
                state.turn.status !== 'initialized') {
                throw Boom.conflict('You can only end a game in-between turns.');
            }

            O(state, {
                status: 'finished',
                turn: null
            });
        }),
        beginTurn: mutation(({ state }, opts) => {

            const { now = Date.now() } = opts || {};

            if (!state.turn || state.turn.status !== 'initialized') {
                throw Boom.conflict('You can only begin a turn that is initialized.');
            }

            const { chooseWord } = internals;
            const { word, nextWords } = chooseWord(state.turn.roundWords);

            O(state, {
                turn: O({
                    status: 'in-progress',
                    roundWords: nextWords,
                    word,
                    lastWord: state.turn.word,
                    start: new Date(now + 5000),
                    end: new Date(now + 5000 + 30000)
                })
            });
        }),
        endTurn: mutation(({ state }, _) => {

            if (!state.turn || state.turn.status !== 'in-progress') {
                throw Boom.conflict('You can only end a turn that is in progress.');
            }

            const { turn } = state;
            const { getNextPlayer } = internals;

            const nextPlayer = getNextPlayer(turn.player, state.playerOrder);

            O(state, {
                turn: {
                    status: 'initialized',
                    round: turn.round,
                    go: turn.go + 1,
                    roundWords: [turn.word, ...turn.roundWords],
                    player: nextPlayer,
                    lastPlayer: turn.player,
                    word: null,
                    lastWord: turn.lastWord,
                    start: null,
                    end: null
                },
                score: O({
                    player: O({
                        [nextPlayer]: O({
                            [turn.round]: O((x) => [...x, 0])
                        })
                    })
                })
            });
        }),
        claimWord: mutation(({ state }, _) => {

            if (!state.turn || state.turn.status !== 'in-progress') {
                throw Boom.conflict('You can only claim a word when a turn is in progress.');
            }

            const { turn } = state;
            const { chooseWord, getNextPlayer } = internals;

            const player = state.players[turn.player];
            state.score.team[player.team][turn.round]++;
            const playerRoundScore = state.score.player[player.nickname][turn.round];
            playerRoundScore[playerRoundScore.length - 1]++;

            const { word, nextWords } = chooseWord(turn.roundWords);

            if (word !== null) {
                O(state, {
                    turn: O({
                        roundWords: nextWords,
                        word,
                        lastWord: turn.word
                    })
                });
                return;
            }

            const nextPlayer = getNextPlayer(turn.player, state.playerOrder);

            O(state, {
                turn: {
                    status: 'initialized',
                    round: turn.round + 1,
                    go: 0,
                    roundWords: state.words,
                    player: nextPlayer,
                    lastPlayer: turn.player,
                    word: null,
                    lastWord: turn.word,
                    start: null,
                    end: null
                },
                score: O({
                    team: O({
                        a: O((x) => [...x, 0]),
                        b: O((x) => [...x, 0])
                    }),
                    player: O((x) => {

                        return O(x, ...Object.entries(x).map(([nickname, scores]) => ({
                            [nickname]: [
                                ...scores,
                                nickname === nextPlayer ? [0] : []
                            ]
                        })));
                    })
                })
            });
        }),
        hasPlayer(game, nickname) {

            const { state: { players } } = game;

            return nickname in players;
        },
        currentPlayerTurn(game) {

            const { state: { turn } } = game;

            return (turn && turn.player) || null;
        },
        present(game, nickname) {

            const {
                id,
                createdAt,
                state: { status, players, playerOrder, score, turn }
            } = game;

            return {
                id,
                createdAt,
                status,
                me: players[nickname] || null,
                players: playerOrder.map((nick) => players[nick]),
                score,
                turn: (status !== 'in-progress') ? null : {
                    status: turn.status,
                    word: (turn.status === 'in-progress' && nickname === turn.player) ? turn.word : null,
                    lastWord: turn.lastWord,
                    go: turn.go,
                    round: turn.round,
                    player: players[turn.player] || null,
                    lastPlayer: players[turn.lastPlayer] || null,
                    start: turn.start,
                    end: turn.end
                }
            };
        }
    };
});

internals.chooseWord = (words) => {

    const nextWords = [...words];
    const randomIndex = Math.floor(Math.random() * words.length);
    const [word = null] = nextWords.splice(randomIndex, 1);

    return { word, nextWords };
};

internals.getNextPlayer = (player, playerOrder) => {

    const playerIndex = playerOrder.indexOf(player);

    return playerOrder[(playerIndex + 1) % playerOrder.length];
};
