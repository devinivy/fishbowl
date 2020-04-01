const React = require('react');
const InitializedGame = require('./InitializedGame');
const Types = require('../../../components/types');

module.exports = function GamePage() {

    return (
        <InitializedGame
            game={Types.game.examples[3]}
        />
    );
};
