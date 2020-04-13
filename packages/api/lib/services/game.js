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
        join: mutation((game, { nickname }) => {

            const { state } = game;
            const { gameService: { hasPlayer } } = services();

            if (state.status !== 'initialized' && state.status !== 'in-progress') {
                throw new Error();
            }

            if (state.status === 'in-progress' && !hasPlayer(game, nickname)) {
                throw new Error();
            }

            if (hasPlayer(game, nickname)) {
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

            const [firstPlayerNickname] = state.playerOrder;

            state.status = 'in-progress';

            state.turn = {
                status: 'initialized',
                round: 0,
                go: 0,
                roundWords: state.words,
                player: firstPlayerNickname,
                lastPlayer: null,
                word: null,
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
        beginTurn: mutation(({ state }, opts) => {

            const { now = Date.now() } = opts || {};

            if (!state.turn || state.turn.status !== 'initialized') {
                throw new Error();
            }

            const { chooseWord } = internals;
            const { word, nextWords } = chooseWord(state.turn.roundWords);

            state.turn = {
                ...state.turn,
                status: 'in-progress',
                roundWords: nextWords,
                word,
                lastWord: state.turn.word,
                start: new Date(now + 5000),
                end: new Date(now + 5000 + 30000)
            };
        }),
        claimWord: mutation(({ state }, _) => {

            if (!state.turn || state.turn.status !== 'in-progress') {
                throw new Error();
            }

            const { turn } = state;
            const { chooseWord } = internals;

            const player = state.players[turn.player];
            state.score.team[player.team][turn.round]++;
            const playerRoundScore = state.score.player[player.nickname][turn.round];
            playerRoundScore[playerRoundScore.length - 1]++;

            const { word, nextWords } = chooseWord(turn.roundWords);

            if (word !== null) {
                state.turn = {
                    ...turn,
                    roundWords: nextWords,
                    word,
                    lastWord: turn.word,
                };
                return;
            }

            const playerIndex = state.playerOrder.indexOf(turn.player);
            const nextPlayerNickname = state.playerOrder[(playerIndex + 1) % state.playerOrder.length];

            state.turn = {
                status: 'initialized',
                round: turn.round + 1,
                go: 0,
                roundWords: state.words,
                player: nextPlayerNickname,
                lastPlayer: turn.player,
                word: null,
                lastWord: turn.word,
                start: null,
                end: null
            };

            state.score.team.a.push(0);
            state.score.team.b.push(0);
            Object.entries(state.score.player).forEach(([nickname, scores]) => {

                scores.push(nickname === nextPlayerNickname ? [0] : []);
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
