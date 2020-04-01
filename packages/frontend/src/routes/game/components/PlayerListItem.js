const React = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Red } = require('@material-ui/core/colors/red');

const internals = {};

module.exports = function PlayerListItem({ player, me, children, secondary, outlineAvatar, ...others }) {

    const { TeamAAvatar, TeamBAvatar } = internals;
    const { nickname, team } = player;

    return (
        <ListItem {...others}>
            <ListItemAvatar>
                {team === 'a' && <TeamAAvatar outline={outlineAvatar}>A</TeamAAvatar>}
                {team === 'b' && <TeamBAvatar outline={outlineAvatar}>B</TeamBAvatar>}
            </ListItemAvatar>
            <ListItemText
                primary={(
                    <>
                        {nickname}
                        {me && me.nickname === nickname && <Box component='span' color='text.disabled'> (you)</Box>}
                    </>
                )}
                secondary={secondary}
            />
            {children}
        </ListItem>
    );
};

module.exports.propTypes = {
    me: T.shape({
        nickname: T.string.isRequired,
        team: T.oneOf(['a', 'b']).isRequired
    }),
    player: T.shape({
        nickname: T.string.isRequired,
        team: T.oneOf(['a', 'b']).isRequired
    }).isRequired,
    secondary: T.node,
    outlineAvatar: T.bool,
    children: T.node
};

internals.TeamAAvatar = Styled(Avatar)`
    background-color: ${Teal[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Teal[50])};
    border: ${({ theme, outline }) => outline && `.25px solid ${theme.palette.common.black}`};
`;

internals.TeamBAvatar = Styled(Avatar)`
    background-color: ${Red[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Red[50])};
    border: ${({ theme, outline }) => outline && `.25px solid ${theme.palette.common.black}`};
`;
