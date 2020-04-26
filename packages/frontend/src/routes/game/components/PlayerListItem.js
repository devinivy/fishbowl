const React = require('react');
const T = require('prop-types');
const { default: Box } = require('@material-ui/core/Box');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const TeamAvatar = require('../../../components/TeamAvatar');
const Types = require('../../../components/types');

const internals = {};

module.exports = function PlayerListItem({ player, me, children, secondary, outlineAvatar, ...others }) {

    const { nickname, team } = player;

    return (
        <ListItem {...others}>
            <ListItemAvatar>
                {team === 'a' && <TeamAvatar.A outline={outlineAvatar}>A</TeamAvatar.A>}
                {team === 'b' && <TeamAvatar.B outline={outlineAvatar}>B</TeamAvatar.B>}
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
    me: Types.player,
    player: Types.player.isRequired,
    secondary: T.node,
    outlineAvatar: T.bool,
    children: T.node
};
