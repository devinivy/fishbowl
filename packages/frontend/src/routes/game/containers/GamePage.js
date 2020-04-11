const React = require('react');
const T = require('prop-types');
const { useEffect } = require('react');
const { useSelector } = require('react-redux');
const InitializedGame = require('../components/InitializedGame');
const { useMiddleEnd } = require('../../../middle-end/react');

module.exports = function GamePage({ match: { params } }) {

    const m = useMiddleEnd();
    const game = useSelector((state) => m.selectors.model.gameById(state, params.id));

    useEffect(() => {

        m.dispatch.model.subscribeGame(params.id);

        return m.dispatch.model.unsubscribeGame;
    }, [m, params.id]);

    if (!game) {
        return null;
    }

    return (
        // eslint-disable-next-line react/jsx-handler-names
        <InitializedGame game={game} onSubmitJoin={m.dispatch.model.joinGame} />
    );
};

module.exports.propTypes = {
    match: T.shape({
        params: T.shape({
            id: T.string.isRequired
        }).isRequired
    }).isRequired
};
