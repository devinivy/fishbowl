const React = require('react');
const HomePage = require('../components/HomePage');
const Types = require('../../../components/types');

module.exports = function HomePageContainer() {

    return (
        <HomePage
            games={Types.game.examples}
        />
    );
};
