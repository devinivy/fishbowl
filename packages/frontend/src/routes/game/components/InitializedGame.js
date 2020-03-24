const React = require('react');
const { useTheme } = require('@material-ui/core/styles');
const { default: useMediaQuery } = require('@material-ui/core/useMediaQuery');
const { default: Styled } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: Button } = require('@material-ui/core/Button');
const { default: TextField } = require('@material-ui/core/TextField');
const { default: Divider } = require('@material-ui/core/Divider');
const { default: Paper } = require('@material-ui/core/Paper');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: LightGreen } = require('@material-ui/core/colors/lightGreen');
const GameListItem = require('../../../components/GameListItem');
const SubmitWordsForm = require('../../../components/SubmitWordsForm');
const Types = require('../../../components/types');

const internals = {};

module.exports = function InitializedGame({ game }) {

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    const { GreenButton } = internals;
    const allPlayersReady = game.players.every(({ status }) => status === 'ready');

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
                <Box
                    display='flex'
                    px={2}
                    py={!game.me && { xs: 2, sm: 1 }}
                    my={game.me ? 1 : 0}
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
            <Box mb={{ sm: 2 }}>
                <Divider />
            </Box>
            {game.me && game.me.status === 'not-ready' && (
                <Box m={{ xs: 1, sm: 0 }}>
                    <Paper variant={smUp ? 'outlined' : 'elevation'} elevation={1} square={!smUp}>
                        <Box p={2}>
                            <Typography variant='subtitle2'>Please pick five words to submit to the fishbowl.</Typography>
                            <SubmitWordsForm onSubmit={(x) => console.log(x)} />
                        </Box>
                    </Paper>
                </Box>
            )}
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
