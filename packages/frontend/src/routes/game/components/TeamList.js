const React = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: List } = require('@material-ui/core/List');
const { default: ListSubheader } = require('@material-ui/core/ListSubheader');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Red } = require('@material-ui/core/colors/red');

const internals = {};

module.exports = function TeamList({ players, me, ...others }) {

    const { TeamAAvatar, TeamBAvatar, onTeamA, onTeamB } = internals;

    const teamA = players.filter(onTeamA);
    const teamB = players.filter(onTeamB);

    return (
        <Box display='flex' flexWrap='wrap' {...others}>
            <Box flex={1} component={List} subheader={<ListSubheader>team a</ListSubheader>}>
                {teamA.map(({ nickname }) => (

                    <ListItem key={nickname}>
                        <ListItemAvatar>
                            <TeamAAvatar>A</TeamAAvatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={(
                                <>
                                    {nickname}
                                    {me && me.nickname === nickname && <Box component='span' color='text.disabled'> (you)</Box>}
                                </>
                            )}
                        />
                    </ListItem>
                ))}
            </Box>
            <Box flex={1} component={List} subheader={<ListSubheader>team b</ListSubheader>}>
                {teamB.map(({ nickname }) => (

                    <ListItem key={nickname}>
                        <ListItemAvatar>
                            <TeamBAvatar>B</TeamBAvatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={(
                                <>
                                    {nickname}
                                    {me && me.nickname === nickname && <Box component='span' color='text.disabled'> (you)</Box>}
                                </>
                            )}
                        />
                    </ListItem>
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

internals.TeamAAvatar = Styled(Avatar)`
    background-color: ${Teal[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Teal[50])};
`;

internals.TeamBAvatar = Styled(Avatar)`
    background-color: ${Red[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Red[50])};
`;
