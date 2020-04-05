const React = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { useTheme } = require('@material-ui/core/styles');
const { default: useUpdate } = require('react-use/lib/useUpdate');
const { default: useMediaQuery } = require('@material-ui/core/useMediaQuery');
// const DifferenceInSeconds = require('date-fns/differenceInSeconds');
const { default: Box } = require('@material-ui/core/Box');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const { default: ListItemSecondaryAction } = require('@material-ui/core/ListItemSecondaryAction');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: Button } = require('@material-ui/core/Button');
const { default: Grow } = require('@material-ui/core/Grow');
const { default: CheckIcon } = require('@material-ui/icons/Check');
const { default: StarsIcon } = require('@material-ui/icons/Stars');
// const { default: Teal } = require('@material-ui/core/colors/teal');
// const { default: Red } = require('@material-ui/core/colors/red');
const PlayerListItem = require('./PlayerListItem');
const ClockCountdown = require('../../../components/ClockCountdown');
const SecondsCountdown = require('../../../components/SecondsCountdown');
const { useFlasher } = require('../../../components/useFlasher');
const { Textfit } = require('react-textfit');

const internals = {};

const NBSP = '\xa0';

module.exports = function TurnInfo({ turn, me, score, ...others }) {

    const theme = useTheme();
    const update = useUpdate();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    const { ClockIconWrapper, getLastItem, flat, words } = internals;
    const { status, player, lastPlayer, word, lastWord, go, round, start, end } = turn;

    const isMe = Boolean(me && player.nickname === me.nickname);
    const isMyTeam = Boolean(me && player.team === me.team);
    const currentScore = getLastItem(score.player[player.nickname][round]);
    const lastScore = lastPlayer && getLastItem(flat(score.player[lastPlayer.nickname]));
    const lastRoundTeamA = round !== 0 && score.team.a[round - 1];
    const lastRoundTeamB = round !== 0 && score.team.b[round - 1];
    const tie = lastRoundTeamA === lastRoundTeamB;
    const winningTeam = lastRoundTeamA > lastRoundTeamB ? 'a' : 'b';
    const winningScore = lastRoundTeamA > lastRoundTeamB ? lastRoundTeamA : lastRoundTeamB;
    const losingScore = lastRoundTeamA > lastRoundTeamB ? lastRoundTeamB : lastRoundTeamA;
    const now = new Date();
    const started = now >= start;
    const showLastWord = useFlasher(lastWord);

    return (
        <Box display='flex' flexDirection='column' {...others}>
            <PlayerListItem
                ContainerComponent='div'
                player={player}
                me={me}
                outlineAvatar
                secondary={me ?
                    (isMe ? 'you\'re up!' :
                        (isMyTeam ? 'your team is up!' : 'the other team is up')
                    ) : null}
            >
                <ListItemSecondaryAction>
                    {status === 'in-progress' && (
                        <Box borderRadius='borderRadius' border={1} textAlign='center' p={1} px={2}>
                            <Typography variant='subtitle2'>{currentScore}</Typography>
                            <Typography variant='caption'>{words(currentScore)}</Typography>
                        </Box>
                    )}
                </ListItemSecondaryAction>
            </PlayerListItem>
            <Box flex={1} display='flex' alignItems='center' justifyContent='center'>
                {!isMe && status === 'initialized' && (
                    <Box textAlign='center'>
                        {go === 0 && <Typography variant='subtitle1' color='textSecondary'>starting round {round + 1}</Typography>}
                        <Typography variant='h4' color='textSecondary'>waiting...</Typography>
                    </Box>
                )}
                {isMe && status === 'initialized' && (
                    <Box textAlign='center'>
                        {go === 0 && <Typography variant='subtitle1' color='textSecondary' gutterBottom>starting round {round + 1}</Typography>}
                        <Button size='small' variant='outlined' color='primary'>Ready</Button>
                    </Box>
                )}
                {status === 'in-progress' && !started && (
                    <div>
                        <Typography variant='h2'>
                            <SecondsCountdown ends={start} onEnd={update} />
                        </Typography>
                    </div>
                )}
                {!isMe && status === 'in-progress' && started && (
                    <Box p={2}>
                        <ClockCountdown
                            key={smUp}
                            start={start}
                            end={end}
                            size={smUp ? 200 : 150}
                            weight={smUp ? 15 : 10}
                            alpha={.8}
                        />
                    </Box>
                )}
                {isMe && status === 'in-progress' && started && (
                    <Grow key={word} in>
                        <Box
                            component={Textfit}
                            pb={4}
                            px={2}
                            max={80}
                            width='100%'
                            lineHeight='100%'
                            alignSelf='stretch'
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            textAlign='center'
                        >
                            {word}
                        </Box>
                    </Grow>
                )}
            </Box>
            <Box minHeight={42}>
                {status === 'initialized' && lastScore !== null && go !== 0 && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar variant='rounded'><CheckIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${lastPlayer.nickname} got ${lastScore} ${words(lastScore)}!`}
                            primaryTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </ListItem>
                )}
                {status === 'initialized' && lastScore !== null && go === 0 && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar variant='rounded'><StarsIcon /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={tie ?
                                `team a and team b tied last round ${winningScore} to ${winningScore}` :
                                `team ${winningTeam} won last round ${winningScore} to ${losingScore}`}
                            secondary={`${lastPlayer.nickname} got ${lastScore} ${words(lastScore)}!`}
                            primaryTypographyProps={{ variant: 'subtitle1' }}
                            secondaryTypographyProps={{ variant: 'subtitle2' }}
                        />
                    </ListItem>
                )}
                {!isMe && status === 'in-progress' && (
                    <Grow in={showLastWord}>
                        <Box textAlign='center'>
                            <CheckIcon />
                            <Typography>{lastWord || NBSP}</Typography>
                        </Box>
                    </Grow>
                )}
                {isMe && status === 'in-progress' && started && (
                    <Box textAlign='center'>
                        <Button
                            variant='contained'
                            color='primary'
                            size='large'
                            fullWidth={!smUp}
                            startIcon={
                                <ClockIconWrapper>
                                    <ClockCountdown
                                        start={start}
                                        end={end}
                                        size={16}
                                        fontSize={0}
                                        weight={2}
                                        alpha={1}
                                        color={theme.palette.primary.contrastText}
                                    />
                                </ClockIconWrapper>
                            }
                        >
                            Got it
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

module.exports.propTypes = {
    me: T.shape({
        nickname: T.string.isRequired,
        team: T.oneOf(['a', 'b']).isRequired
    }),
    score: T.shape({
        team: T.shape({
            a: T.arrayOf(T.number).isRequired,
            b: T.arrayOf(T.number).isRequired
        }).isRequired,
        player: T.objectOf(T.arrayOf(T.number).isRequired).isRequired
    }),
    turn: T.object.isRequired
};

internals.ClockIconWrapper = Styled.span`
    display: inline-block;
    > * {
        position: relative;
        canvas {
            left: 0;
        }
    }
`;

internals.getLastItem = (arr) => arr[arr.length - 1];

internals.flat = (arr) => {

    return arr.reduce((a, b) => [].concat(a).concat(b), []);
};

internals.words = (count) => {

    if (count === 1) {
        return 'word';
    }

    return 'words';
};
