'use strict';

const Schmervice = require('schmervice');

const internals = {};

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
                return;
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

            if (!words || !words.length) {
                throw new Error();
            }

            state.players[nickname] = { ...player, status: 'ready' };
            state.words.push(...words);
        }),
        begin: mutation(({ state }, _) => {

            if (state.status !== 'initialized') {
                throw new Error();
            }

            const players = Object.values(state.players);
            const playerIsReady = ({ status }) => status === 'ready';

            if (players.length < 2 || !players.every(playerIsReady)) {
                throw new Error();
            }

            const { chooseWord } = internals;
            const { word, nextWords } = chooseWord(state.words);
            const [firstPlayerNickname] = state.playerOrder;

            state.status = 'in-progress';

            state.turn = {
                status: 'initialized',
                round: 0,
                go: 0,
                roundWords: nextWords,
                player: firstPlayerNickname,
                lastPlayer: null,
                word,
                lastWord: null,
                start: null,
                end: null
            };

            state.score.team.a.push(0);
            state.score.team.b.push(0);
            Object.entries(state.score.player).forEach(([nickname, scores]) => {

                scores.push(nickname === firstPlayerNickname ? [0] : []);
            });
        }),
        hasPlayer(game, nickname) {

            const { state: { players } } = game;

            return nickname in players;
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
                    word: nickname === turn.player ? turn.word : null,
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
    const [word] = nextWords.splice(randomIndex, 1);

    return { word, nextWords };
};
