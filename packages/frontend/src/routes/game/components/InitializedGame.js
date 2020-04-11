/* eslint-disable jsx-a11y/no-autofocus */
const React = require('react');
const { useState } = require('react');
const T = require('prop-types');
const { useTheme } = require('@material-ui/core/styles');
const { default: Styled } = require('styled-components');
const { default: useToggle } = require('react-use/lib/useToggle');
const { default: Box } = require('@material-ui/core/Box');
const { default: Button } = require('@material-ui/core/Button');
const { default: TextField } = require('@material-ui/core/TextField');
const { default: Divider } = require('@material-ui/core/Divider');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: IconButton } = require('@material-ui/core/IconButton');
const { default: CancelIcon } = require('@material-ui/icons/Cancel');
const { default: LightGreen } = require('@material-ui/core/colors/lightGreen');
const Types = require('../../../components/types');
const GameHeader = require('./GameHeader');
const GameSection = require('./GameSection');
const TeamList = require('./TeamList');
const SubmitWordsForm = require('./SubmitWordsForm');

const internals = {};

module.exports = function InitializedGame({ game, onSubmitJoin, onSubmitWords }) {

    const theme = useTheme();
    const [showJoin, toggleShowJoin] = useToggle(true);
    const [nickname, setNickname] = useState('');

    const { GreenButton, CloseIconButton } = internals;
    const allPlayersReady = game.players.every(({ status }) => status === 'ready');

    return (
        <Box maxWidth={theme.breakpoints.values.md} width='100%' mx='auto'>
            <GameHeader game={game}>
                {game.me && (
                    <GameHeader.Action my={1}>
                        <GreenButton
                            fullWidth
                            disabled={!allPlayersReady}
                            title={!allPlayersReady && 'not all players are ready'}
                            variant='contained'
                        >
                            begin
                        </GreenButton>
                    </GameHeader.Action>
                )}
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
                <TeamList players={game.players} me={game.me} />
            </GameSection>
            {game.me && game.me.status === 'not-ready' && (
                <GameSection>
                    <Typography variant='subtitle2'>
                        Please pick five words to submit to the fishbowl.
                    </Typography>
                    <SubmitWordsForm
                        autoFocus
                        onSubmit={(words) => onSubmitWords({ words })}
                    />
                </GameSection>
            )}
        </Box>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired,
    onSubmitJoin: T.func.isRequired,
    onSubmitWords: T.func.isRequired
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
