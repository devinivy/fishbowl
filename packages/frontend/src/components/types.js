const T = require('prop-types');

exports.player = T.shape({
    nickname: T.string.isRequired,
    status: T.oneOf(['ready', 'not-ready']).isRequired,
    team: T.oneOf(['a', 'b']).isRequired
});

exports.turn = T.shape({
    status: T.oneOf(['initialized', 'in-progress']).isRequired,
    word: T.string,
    lastWord: T.string,
    go: T.number.isRequired,
    round: T.number.isRequired,
    player: exports.player.isRequired,
    lastPlayer: exports.player,
    start: T.instanceOf(Date),
    end: T.instanceOf(Date)
});

exports.score = T.shape({
    team: T.shape({
        a: T.arrayOf(T.number).isRequired,
        b: T.arrayOf(T.number).isRequired
    }).isRequired,
    player: T.objectOf(
        T.arrayOf(
            T.arrayOf(T.number)
        ).isRequired
    ).isRequired
});

exports.game = T.shape({
    id: T.oneOfType([T.string, T.number]).isRequired,
    version: T.number.isRequired,
    createdAt: T.instanceOf(Date),
    status: T.oneOf(['initialized', 'in-progress', 'finished']),
    players: T.arrayOf(exports.player).isRequired,
    turn: exports.turn,
    score: exports.score.isRequired
});

exports.game.examples = [
    {
        id: 1,
        status: 'initialized',
        me: null,
        createdAt: new Date(),
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'hannah', status: 'not-ready', team: null },
            { nickname: 'devin', status: 'ready', team: 'b' },
            { nickname: 'ashton', status: 'ready', team: 'a' }
        ],
        turn: null,
        score: {
            team: {
                a: [],
                b: []
            },
            player: {
                harper: [],
                hannah: [],
                devin: [],
                ashton: []
            }
        }
    },
    {
        id: 10,
        status: 'initialized',
        me: { nickname: 'devin', status: 'ready', team: 'a' },
        createdAt: new Date(),
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'hannah', status: 'not-ready', team: null },
            { nickname: 'devin', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' }
        ],
        turn: null,
        score: {
            team: {
                a: [],
                b: []
            },
            player: {
                harper: [],
                hannah: [],
                devin: [],
                ashton: []
            }
        }
    },
    {
        id: 100,
        status: 'initialized',
        me: { nickname: 'devin', status: 'not-ready', team: 'a' },
        createdAt: new Date(),
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'hannah', status: 'not-ready', team: 'b' },
            { nickname: 'devin', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' }
        ],
        turn: null,
        score: {
            team: {
                a: [],
                b: []
            },
            player: {
                harper: [],
                hannah: [],
                devin: [],
                ashton: []
            }
        }
    },
    {
        id: 2,
        status: 'in-progress',
        me: null,
        createdAt: new Date(Date.now() - 1000000),
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' },
            { nickname: 'devin', status: 'ready', team: 'a' }
        ],
        turn: {
            status: 'initialized',  // or in-progress
            word: 'something',      // null when not your turn
            lastWord: 'abraham lincoln',
            go: 0,    // 0-indexed
            round: 2, // 0-indexed
            player: { nickname: 'ashton', status: 'ready', team: 'b' },
            lastPlayer: { nickname: 'harper', status: 'ready', team: 'a' },
            start: null,
            end: null
        },
        score: {
            team: {
                a: [7, 9, 6],
                b: [6, 3, 5]
            },
            player: {
                harper: [[4], [5], [4]],
                ashton: [[6], [3], [5]],
                devin: [[3], [4], [2]]
            }
        }
    },
    {
        id: 20,
        status: 'in-progress',
        me: null,
        createdAt: new Date(Date.now() - 1000000),
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' },
            { nickname: 'devin', status: 'ready', team: 'a' }
        ],
        turn: {
            status: 'in-progress',
            word: null,      // null when not your turn
            lastWord: 'bobby',
            go: 0,    // 0-indexed
            round: 2, // 0-indexed
            player: { nickname: 'ashton', status: 'ready', team: 'b' },
            lastPlayer: { nickname: 'harper', status: 'ready', team: 'a' },
            start: new Date(Date.now() + 10000),
            end: new Date(Date.now() + 40000)
        },
        score: {
            team: {
                a: [7, 9, 6],
                b: [6, 3, 5]
            },
            player: {
                harper: [[4], [5], [4]],
                ashton: [[6], [3], [5]],
                devin: [[3], [4], [2]]
            }
        }
    },
    {
        id: 3,
        status: 'finished',
        me: null,
        createdAt: new Date(Date.now() - 100000000),
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'devin', status: 'ready', team: 'b' },
            { nickname: 'ashton', status: 'ready', team: 'a' }
        ],
        turn: null,
        score: {
            team: {
                a: [10, 8, 9, 6],
                b: [3, 4, 2, 6]
            },
            player: {
                harper: [[4], [5], [4], [2]],
                devin: [[3], [4], [2], [6]],
                ashton: [[6], [3], [5], [4]]
            }
        }
    }
];
