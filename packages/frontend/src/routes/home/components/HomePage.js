const React = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: Fab } = require('@material-ui/core/Fab');
const { default: List } = require('@material-ui/core/List');
const { default: AddIcon } = require('@material-ui/icons/Add');
const Link = require('../../../components/Link');
const GameListItem = require('../../../components/GameListItem');
const Types = require('../../../components/types');

const internals = {};

module.exports = function HomePage({ games }) {

    const { CornerFab } = internals;
    const now = new Date();

    return (
        <Box
            width={{ xs: '100%', sm: 600 }}
            mx='auto'
            boxShadow={1}
            bgcolor='background.paper'
            position='relative'
        >
            <Box mx={2} mt={2}>
                <Typography component='h2' variant='h5'>games</Typography>
            </Box>
            <List>
                {games.map((game) => {

                    return (
                        <GameListItem
                            key={game.id}
                            button
                            component={Link}
                            to={`/game/${game.id}`}
                            game={game}
                            now={now}
                        />
                    );
                })}
            </List>
            <CornerFab aria-label='New Game' color='primary'>
                <AddIcon />
            </CornerFab>
        </Box>
    );
};

module.exports.propTypes = {
    games: T.arrayOf(Types.game).isRequired
};

internals.CornerFab = Styled(Fab)`
    position: absolute;
    bottom: ${({ theme }) => theme.spacing(3)}px;
    right: ${({ theme }) => theme.spacing(3)}px;
`;
