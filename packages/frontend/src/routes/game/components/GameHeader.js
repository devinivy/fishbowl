const React = require('react');
const T = require('prop-types');
const { default: Box } = require('@material-ui/core/Box');
const Types = require('../../../components/types');
const GameListItem = require('../../../components/GameListItem');

const internals = {};

module.exports = function GameHeader({ game, listItemChildren, children, ...others }) {

    return (
        <Box
            display='flex'
            flexWrap='wrap'
            justifyContent='space-between'
            mt={{ xs: 0, sm: 2 }}
            mb={{ xs: 0, sm: 1 }}
            {...others}
        >
            <Box flexGrow={2}>
                <GameListItem
                    component='div'
                    ContainerComponent='div'
                    game={game}
                >
                    {listItemChildren}
                </GameListItem>
            </Box>
            {children}
        </Box>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired,
    children: T.node,
    listItemChildren: T.node
};

module.exports.Action = function GameHeaderAction(props) {

    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            px={2}
            flexGrow={{ xs: 1, sm: 0 }}
            flexShrink={1}
            borderRadius={{ xs: 0, sm: 'borderRadius' }}
            {...props}
        />
    );
};
