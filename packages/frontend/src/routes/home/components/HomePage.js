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
const { useAppTime } = require('../../../containers/useAppTime');

const internals = {};

module.exports = function HomePage({ games, onClickAdd, ...others }) {

    const getTime = useAppTime();
    const { CornerFab } = internals;
    const now = getTime();

    return (
        <Box
            width={{ xs: '100%', sm: 600 }}
            mx='auto'
            boxShadow={1}
            bgcolor='background.paper'
            position='relative'
            {...others}
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
            <CornerFab onClick={onClickAdd} aria-label='New Game' color='primary'>
                <AddIcon />
            </CornerFab>
        </Box>
    );
};

module.exports.propTypes = {
    games: T.arrayOf(Types.game).isRequired,
    onClickAdd: T.func
};

internals.CornerFab = Styled(Fab)`
    position: fixed;
    bottom: ${({ theme }) => theme.spacing(3)}px;
    right: ${({ theme }) => theme.spacing(3)}px;
    // Take into account auto margins around list
    ${({ theme }) => theme.breakpoints.up('sm')} {
        right: calc(${({ theme }) => theme.spacing(3)}px + (100% - 600px) / 2);
    }
    // When page padding kicks-in, it trumps the auto margins around list
    ${({ theme }) => theme.breakpoints.up('sm')} and
        (max-width: ${({ theme }) => 600 + 2 * theme.spacing(3)}px) {
        right: ${({ theme }) => 2 * theme.spacing(3)}px;
    }
`;
