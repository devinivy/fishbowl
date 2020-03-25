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
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'hannah', status: 'not-ready', team: null },
            { nickname: 'devin', status: 'ready', team: 'b' },
            { nickname: 'ashton', status: 'ready', team: 'a' }
        ],
        createdAt: new Date()
    },
    {
        id: 10,
        status: 'initialized',
        me: { nickname: 'devin', status: 'ready', team: 'a' },
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'hannah', status: 'not-ready', team: null },
            { nickname: 'devin', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' }
        ],
        createdAt: new Date()
    },
    {
        id: 10,
        status: 'initialized',
        me: { nickname: 'devin', status: 'not-ready', team: 'a' },
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'hannah', status: 'ready', team: 'b' },
            { nickname: 'devin', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' }
        ],
        createdAt: new Date()
    },
    {
        id: 2,
        status: 'in-progress',
        me: null,
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'ashton', status: 'ready', team: 'b' },
            { nickname: 'devin', status: 'ready', team: 'a' }
        ],
        createdAt: new Date(Date.now() - 1000000)
    },
    {
        id: 3,
        status: 'finished',
        me: null,
        players: [
            { nickname: 'harper', status: 'ready', team: 'a' },
            { nickname: 'devin', status: 'ready', team: 'b' },
            { nickname: 'ashton', status: 'ready', team: 'a' }
        ],
        createdAt: new Date(Date.now() - 100000000)
    }
];
