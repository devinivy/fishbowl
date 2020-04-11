const React = require('react');
const { useEffect, useCallback } = require('react');
const { useSelector, shallowEqual } = require('react-redux');
const HomePage = require('../components/HomePage');
const { useMiddleEnd } = require('../../../middle-end/react');

module.exports = function HomePageContainer() {

    const m = useMiddleEnd();
    const games = useSelector(m.selectors.model.games, shallowEqual);
    const handleClickAdd = useCallback(async () => {

        const [err, results] = await m.dispatch.model.createGame();

        if (!err) {
            m.dispatch.router.push(`/game/${results.result}`);
        }
    }, [m]);

    useEffect(() => {

        m.dispatch.model.getGames();
    }, []);

    return (
        <HomePage games={games} onClickAdd={handleClickAdd} />
    );
};
