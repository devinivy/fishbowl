const T = require('prop-types');

exports.game = T.shape({
    id: T.number.isRequired,
    status: T.oneOf(['initialized', 'in-progress', 'finished']),
    players: T.arrayOf(T.string).isRequired,
    createdAt: T.instanceOf(Date)
});
