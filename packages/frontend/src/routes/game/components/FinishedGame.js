const React = require('react');
const { useTheme } = require('@material-ui/core/styles');
const { default: Box } = require('@material-ui/core/Box');
const { default: Divider } = require('@material-ui/core/Divider');
const GameListItem = require('../../../components/GameListItem');
const Types = require('../../../components/types');
const GameSection = require('./GameSection');
const TeamList = require('./TeamList');
const ScoreSummary = require('./ScoreSummary');

const internals = {};

// eslint-disable-next-line react/prop-types
module.exports = function FinishedGame({ game }) {

    const theme = useTheme();

    return (
        <Box maxWidth={theme.breakpoints.values.md} width='100%' mx='auto'>
            <Box
                display='flex'
                flexWrap='wrap'
                justifyContent='space-between'
                mt={{ xs: 0, sm: 2 }}
                mb={{ xs: 0, sm: 1 }}
            >
                <Box flexGrow={2}>
                    <GameListItem component='div' game={game} />
                </Box>
            </Box>
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
