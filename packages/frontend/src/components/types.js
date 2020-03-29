const T = require('prop-types');

exports.game = T.shape({
    id: T.number.isRequired,
    status: T.oneOf(['initialized', 'in-progress', 'finished']),
    players: T.arrayOf(T.string).isRequired,
    createdAt: T.instanceOf(Date)
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
            status: 'initialized', // or in-progress
            go: 1,    // 0-indexed
            round: 3, // 0-indexed
            player: { nickname: 'ashton', status: 'ready', team: 'b' },
            start: null,
            end: null
        },
        score: {
            team: {
                a: [7, 9, 6],
                b: [6, 3, 5]
            },
            player: {
                harper: [4, 5, 4],
                ashton: [6, 3, 5],
                devin: [3, 4, 2]
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
                harper: [4, 5, 4, 2],
                devin: [3, 4, 2, 6],
                ashton: [6, 3, 5, 4]
            }
        }
    }
];
