const React = require('react');
const T = require('prop-types');
const { default: Box } = require('@material-ui/core/Box');
const { default: List } = require('@material-ui/core/List');
const { default: ListSubheader } = require('@material-ui/core/ListSubheader');
const PlayerListItem = require('./PlayerListItem');

const internals = {};

module.exports = function TeamList({ players, me, ...others }) {

    const { onTeamA, onTeamB } = internals;

    const teamA = players.filter(onTeamA);
    const teamB = players.filter(onTeamB);

    return (
        <Box display='flex' flexWrap='wrap' {...others}>
            <Box flex={1} component={List} subheader={<ListSubheader>team a</ListSubheader>}>
                {teamA.map((player) => (

                    <PlayerListItem key={player.nickname} player={player} me={me} />
                ))}
            </Box>
            <Box flex={1} component={List} subheader={<ListSubheader>team b</ListSubheader>}>
                {teamB.map((player) => (

                    <PlayerListItem key={player.nickname} player={player} me={me} />
                ))}
            </Box>
        </Box>
    );
};

module.exports.propTypes = {
    me: T.shape({
        nickname: T.string.isRequired
    }),
    players: T.arrayOf(T.shape({
        nickname: T.string.isRequired,
        team: T.oneOf(['a', 'b']),
        status: T.string.isRequired
    }))
};

internals.onTeamA = ({ team }) => team === 'a';

internals.onTeamB = ({ team }) => team === 'b';
