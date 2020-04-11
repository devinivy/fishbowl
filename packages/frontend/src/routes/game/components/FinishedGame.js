const React = require('react');
const { useTheme } = require('@material-ui/core/styles');
const { default: Box } = require('@material-ui/core/Box');
const { default: Divider } = require('@material-ui/core/Divider');
const Types = require('../../../components/types');
const GameHeader = require('./GameHeader');
const GameSection = require('./GameSection');
const TeamList = require('./TeamList');
const ScoreSummary = require('./ScoreSummary');

const internals = {};

module.exports = function FinishedGame({ game }) {

    const theme = useTheme();

    return (
        <Box maxWidth={theme.breakpoints.values.md} width='100%' mx='auto'>
            <GameHeader game={game} />
            <Box mb={{ sm: 2 }}>
                <Divider />
            </Box>
            <GameSection>
                <ScoreSummary status={game.status} score={game.score} />
            </GameSection>
            <GameSection>
                <TeamList players={game.players} me={game.me} />
            </GameSection>
        </Box>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired
};
