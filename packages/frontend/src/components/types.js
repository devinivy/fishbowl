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
            { nickname: 'harper', status: 'ready' },
            { nickname: 'hannah', status: 'not-ready' },
            { nickname: 'devin', status: 'ready' },
            { nickname: 'ashton', status: 'ready' }
        ],
        createdAt: new Date()
    },
    {
        id: 10,
        status: 'initialized',
        me: { nickname: 'devin', status: 'ready' },
        players: [
            { nickname: 'harper', status: 'ready' },
            { nickname: 'hannah', status: 'not-ready' },
            { nickname: 'devin', status: 'ready' },
            { nickname: 'ashton', status: 'ready' }
        ],
        createdAt: new Date()
    },
    {
        id: 2,
        status: 'in-progress',
        me: null,
        players: [
            { nickname: 'harper', status: 'ready' },
            { nickname: 'ashton', status: 'ready' },
            { nickname: 'devin', status: 'ready' }
        ],
        createdAt: new Date(Date.now() - 1000000)
    },
    {
        id: 3,
        status: 'finished',
        me: null,
        players: [
            { nickname: 'harper', status: 'ready' },
            { nickname: 'devin', status: 'ready' },
            { nickname: 'ashton', status: 'ready' }
        ],
        createdAt: new Date(Date.now() - 100000000)
    }
];
