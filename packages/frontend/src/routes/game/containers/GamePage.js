/* eslint-disable react/jsx-handler-names */
const React = require('react');
const { useEffect } = require('react');
const T = require('prop-types');
const { useSelector } = require('react-redux');
const InitializedGame = require('../components/InitializedGame');
const InProgressGame = require('../components/InProgressGame');
const FinishedGame = require('../components/FinishedGame');
const BadImplementation = require('../../../components/BadImplementation');
const { useMiddleEnd } = require('../../../middle-end/react');

module.exports = function GamePage({ match: { params } }) {

    const m = useMiddleEnd();
    const game = useSelector((state) => m.selectors.model.gameById(state, params.id));

    useEffect(() => {

        m.dispatch.model.subscribeGame(params.id);

        return m.dispatch.model.unsubscribeGame;
    }, [m, params.id]);

    if (!game) {
        return null; // TODO loading / not found
    }

    if (game.status === 'initialized') {
        return (
            <InitializedGame
                game={game}
                onSubmitJoin={m.dispatch.model.joinGame}
                onSubmitWords={m.dispatch.model.playerReady}
                onClickBeginGame={() => m.dispatch.model.beginGame()}
            />
        );
    }

    if (game.status === 'in-progress') {
        return (
            <InProgressGame
                game={game}
                onSubmitJoin={m.dispatch.model.joinGame}
                onClickTurnReady={() => m.dispatch.model.beginTurn()}
                onClickGotWord={() => m.dispatch.model.claimWord()}
                onConfirmEndGame={() => m.dispatch.model.endGame()}
            />
        );
    }

    if (game.status === 'finished') {
        return <FinishedGame game={game} />;
    }

    return <BadImplementation />;
};

module.exports.propTypes = {
    match: T.shape({
        params: T.shape({
            id: T.string.isRequired
        }).isRequired
    }).isRequired
};
