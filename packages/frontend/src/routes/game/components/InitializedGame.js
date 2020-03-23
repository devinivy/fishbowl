const React = require('react');
const { default: Styled } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: Button } = require('@material-ui/core/Button');
const { default: TextField } = require('@material-ui/core/TextField');
const { default: LightGreen } = require('@material-ui/core/colors/lightGreen');
const GameListItem = require('../../../components/GameListItem');
const Types = require('../../../components/types');

const internals = {};

module.exports = function InitializedGame({ game }) {

    const { GreenButton } = internals;

    const allPlayersReady = game.players.every(({ status }) => status === 'ready');

    return (
        <Box width='100%'>
            <Box
                display='flex'
                flexWrap='wrap'
                justifyContent='space-between'
                mt={{ xs: 0, sm: 2 }}
            >
                <Box flexGrow={2}>
                    <GameListItem component='div' game={game} />
                </Box>
                <Box
                    display='flex'
                    px={2}
                    py={!game.me && { xs: 2, sm: 1 }}
                    bgcolor={!game.me && 'secondary.main'}
                    alignItems='center'
                    justifyContent='center'
                    flexBasis={!game.me && 230}
                    flexGrow={{ xs: 1, sm: 0 }}
                    flexShrink={1}
                    borderRadius={{ xs: 0, sm: 'borderRadius' }}
                >
                    {game.me && (
                        <GreenButton
                            fullWidth
                            disabled={!allPlayersReady}
                            title={!allPlayersReady && 'not all players are ready'}
                            variant='contained'
                        >
                            begin
                        </GreenButton>
                    )}
                    {!game.me && (
                        <>
                            <Box mr={2}>
                                <Button variant='outlined'>join</Button>
                            </Box>
                            <Box>
                                <TextField fullWidth placeholder='nickname' />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired
};

internals.GreenButton = Styled(Button)`
    background-color: ${LightGreen[500]};
    :hover {
        background-color: ${LightGreen[500]};
    }
`;
