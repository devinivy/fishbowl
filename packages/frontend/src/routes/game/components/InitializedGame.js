const React = require('react');
const { useState, useCallback } = require('react');
const { useTheme } = require('@material-ui/core/styles');
const { default: Styled } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: Button } = require('@material-ui/core/Button');
const { default: TextField } = require('@material-ui/core/TextField');
const { default: Divider } = require('@material-ui/core/Divider');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: IconButton } = require('@material-ui/core/IconButton');
const { default: CloseIcon } = require('@material-ui/icons/Cancel');
const { default: LightGreen } = require('@material-ui/core/colors/lightGreen');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Red } = require('@material-ui/core/colors/red');
const GameListItem = require('../../../components/GameListItem');
const SubmitWordsForm = require('../../../components/SubmitWordsForm');
const Types = require('../../../components/types');
const GameSection = require('./GameSection');
const TeamList = require('./TeamList');
const TurnInfo = require('./TurnInfo');

const internals = {};

module.exports = function InitializedGame({ game }) {

    const theme = useTheme();
    const [showJoin, setShowJoin] = useState(true);
    const handleCloseJoin = useCallback(() => setShowJoin(false), []);

    const { GreenButton, CloseIconButton } = internals;
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
                {(game.me || showJoin) && (
                    <Box
                        display='flex'
                        position='relative'
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
                                <CloseIconButton
                                    title='spectate'
                                    size='small'
                                    onClick={handleCloseJoin}
                                >
                                    <CloseIcon />
                                </CloseIconButton>
                                <Box mr={2}>
                                    <Button variant='outlined'>join</Button>
                                </Box>
                                <Box>
                                    <TextField fullWidth placeholder='nickname' />
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </Box>
            <Box mb={{ sm: 2 }}>
                <Divider />
            </Box>
            {game.turn && (
                <GameSection
                    bgcolor={game.turn.player.team === 'a' ? Teal[50] : Red[50]}
                >
                    <TurnInfo minHeight={375} turn={game.turn} me={game.me} score={game.score} />
                </GameSection>
            )}
            <GameSection>
                <TeamList players={game.players} me={game.me} />
            </GameSection>
            {game.me && game.me.status === 'not-ready' && (
                <GameSection>
                    <Typography variant='subtitle2'>Please pick five words to submit to the fishbowl.</Typography>
                    <SubmitWordsForm onSubmit={(x) => console.log(x)} />
                </GameSection>
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
    @media (max-width: 375px) {
        margin-top: -${({ theme }) => theme.spacing(1)}px;
    }
`;

internals.CloseIconButton = Styled(IconButton)`
    position: absolute;
    top: -${({ theme }) => theme.spacing(1)}px;
    right: -${({ theme }) => theme.spacing(1)}px;
    svg {
        width: .75em;
        height: .75em;
    }
`;
