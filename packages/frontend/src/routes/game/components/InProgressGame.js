const React = require('react');
const { useState } = require('react');
const T = require('prop-types');
const { useTheme } = require('@material-ui/core/styles');
const { default: Styled } = require('styled-components');
const { default: useToggle } = require('react-use/lib/useToggle');
const { default: Dialog } = require('@material-ui/core/Dialog');
const { default: Toolbar } = require('@material-ui/core/Toolbar');
const { default: Box } = require('@material-ui/core/Box');
const { default: Button } = require('@material-ui/core/Button');
const { default: TextField } = require('@material-ui/core/TextField');
const { default: Divider } = require('@material-ui/core/Divider');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: IconButton } = require('@material-ui/core/IconButton');
const { default: CancelIcon } = require('@material-ui/icons/Cancel');
const { default: CloseIcon } = require('@material-ui/icons/Close');
const { default: LaunchIcon } = require('@material-ui/icons/Launch');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Red } = require('@material-ui/core/colors/red');
const Types = require('../../../components/types');
const GameHeader = require('./GameHeader');
const GameSection = require('./GameSection');
const TeamList = require('./TeamList');
const TurnInfo = require('./TurnInfo');
const ScoreSummary = require('./ScoreSummary');

const internals = {};

module.exports = function InProgressGame({ game, onSubmitJoin }) {

    const theme = useTheme();
    const [showJoin, toggleShowJoin] = useToggle(true);
    const [nickname, setNickname] = useState('');
    const [expandTurn, toggleExpandTurn] = useToggle(false);

    const { CloseIconButton, LaunchIconButton } = internals;

    return (
        <Box maxWidth={theme.breakpoints.values.md} width='100%' mx='auto'>
            <GameHeader game={game}>
                {!game.me && showJoin && (
                    <GameHeader.Action
                        component='form'
                        position='relative'
                        py={{ xs: 2, sm: 1 }}
                        bgcolor='secondary.main'
                        flexBasis={230}
                        onSubmit={(ev) => {

                            ev.preventDefault();
                            onSubmitJoin({ nickname });
                        }}
                    >
                        <CloseIconButton
                            title='spectate'
                            size='small'
                            onClick={toggleShowJoin}
                        >
                            <CancelIcon />
                        </CloseIconButton>
                        <Box mr={2}>
                            <Button type='submit' variant='outlined'>join</Button>
                        </Box>
                        <Box>
                            <TextField
                                fullWidth
                                placeholder='nickname'
                                onChange={(ev) => setNickname(ev.target.value)}
                                value={nickname}
                            />
                        </Box>
                    </GameHeader.Action>
                )}
            </GameHeader>
            <Box mb={{ sm: 2 }}>
                <Divider />
            </Box>
            <GameSection>
                <ScoreSummary status={game.status} score={game.score} />
            </GameSection>
            <GameSection
                position='relative'
                bgcolor={game.turn.player.team === 'a' ? Teal[50] : Red[50]}
            >
                <LaunchIconButton
                    title='launch'
                    size='small'
                    onClick={toggleExpandTurn}
                >
                    <LaunchIcon />
                </LaunchIconButton>
                <TurnInfo minHeight={375} turn={game.turn} me={game.me} score={game.score} />
            </GameSection>
            <Dialog fullScreen open={expandTurn} onClose={toggleExpandTurn}>
                <Toolbar variant='dense'>
                    <Box component={Typography} flex={1}>
                        <Box component='span' ml={1}>
                            <span role='img' aria-label='fish'>🐟</span>
                        </Box>
                    </Box>
                    {game.me && (
                        <Box component={Typography} mr={1} variant='subtitle2'>
                            <Box component='span' mr={.5}>
                                <span role='img' aria-label='hi'>👋</span>
                            </Box>
                            {game.me.nickname}
                        </Box>
                    )}
                    <IconButton size='small' edge='end' onClick={toggleExpandTurn}>
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
                <Box p={1} bgcolor={game.turn.player.team === 'a' ? Teal[50] : Red[50]} display='flex' flex={1}>
                    <TurnInfo flex={1} turn={game.turn} me={game.me} score={game.score} />
                </Box>
            </Dialog>
            <GameSection>
                <TeamList players={game.players} me={game.me} />
            </GameSection>
        </Box>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired,
    onSubmitJoin: T.func.isRequired
};

internals.CloseIconButton = Styled(IconButton)`
    position: absolute;
    top: -${({ theme }) => theme.spacing(1)}px;
    right: -${({ theme }) => theme.spacing(1)}px;
    svg {
        width: .75em;
        height: .75em;
    }
`;

internals.LaunchIconButton = Styled(IconButton)`
    position: absolute;
    top: 0px;
    right: 0px;
    svg {
        width: .75em;
        height: .75em;
    }
`;
