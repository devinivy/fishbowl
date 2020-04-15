const React = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { default: Badge } = require('@material-ui/core/Badge');
const { default: Box } = require('@material-ui/core/Box');
const { default: Typography } = require('@material-ui/core/Typography');
const TeamAvatar = require('../../../components/TeamAvatar');

const internals = {};

module.exports = function ScoreSummary({ status, score, ...others }) {

    const { InlineAvatar, sum, flat, englishList } = internals;

    if (status === 'initialized') {
        // Not meant for use in initialized games
        return null;
    }

    if (status === 'finished') {

        const totalTeamA = score.team.a.reduce(sum, 0);
        const totalTeamB = score.team.b.reduce(sum, 0);
        const tie = totalTeamA === totalTeamB;
        const winningTeam = totalTeamA > totalTeamB ? 'a' : 'b';
        const WinningAvatar = (winningTeam === 'a' ? TeamAvatar.A : TeamAvatar.B);
        const winningScore = totalTeamA > totalTeamB ? totalTeamA : totalTeamB;
        const losingScore = totalTeamA > totalTeamB ? totalTeamB : totalTeamA;

        const maxPlayerScore = Math.max(
            ...Object.values(score.player)
                .map((scores) => flat(scores).reduce(sum, 0))
        );

        const mvps = Object.entries(score.player)
            .map(([nickname, scores]) => [nickname, flat(scores).reduce(sum, 0)])
            .filter(([, tallied]) => tallied === maxPlayerScore)
            .map(([nickname]) => nickname);

        return (
            <Box textAlign='center' {...others}>
                {tie && (
                    <>
                        <Box mb={1}>
                            <InlineAvatar as={TeamAvatar.A} />
                            <Box component='span' ml={.5}>
                                <span role='img' aria-label='handshake'>🤝</span>
                            </Box>
                            <InlineAvatar as={TeamAvatar.B} />
                        </Box>
                        <Typography>
                            it was a tie, {winningScore} to {winningScore}
                        </Typography>
                    </>
                )}
                {!tie && (
                    <>
                        <Box mb={1}>
                            <Badge
                                overlap='circle'
                                badgeContent={<span role='img' aria-label='star'>⭐</span>}
                            >
                                <WinningAvatar />
                            </Badge>
                        </Box>
                        <Typography>
                            team {winningTeam} won, {winningScore} to {losingScore}!
                        </Typography>
                    </>
                )}
                <Typography variant='caption'>
                    <span role='img' aria-label='handshake'>💫</span>
                    the {mvps.length === 1 ? 'mvp is ' : 'mvps are '}
                    {englishList(mvps)} with {maxPlayerScore} words
                </Typography>
            </Box>
        );
    }

    const completedRounds = score.team.a.length - 1;
    const totalTeamA = score.team.a.slice(0, -1).reduce(sum, 0);
    const totalTeamB = score.team.b.slice(0, -1).reduce(sum, 0);
    const tie = totalTeamA === totalTeamB;
    const winningTeam = totalTeamA > totalTeamB ? 'a' : 'b';
    const WinningAvatar = (winningTeam === 'a' ? TeamAvatar.A : TeamAvatar.B);
    const winningScore = totalTeamA > totalTeamB ? totalTeamA : totalTeamB;
    const losingScore = totalTeamA > totalTeamB ? totalTeamB : totalTeamA;

    // in-progress
    return (
        <Box textAlign='center' {...others}>
            {completedRounds <= 0 && (
                <Typography color='textSecondary'>
                    waiting for the results of the first round...
                </Typography>
            )}
            {completedRounds > 0 && (
                <>
                    {tie && (
                        <Typography>
                            it's a tie, {winningScore} to {winningScore}
                        </Typography>
                    )}
                    {!tie && (
                        <Typography>
                            team
                            <Box component='span' mx={-.5}>
                                <InlineAvatar as={WinningAvatar} />
                            </Box>
                            is winning, {winningScore} to {losingScore}
                        </Typography>
                    )}
                    <Typography variant='caption'>
                        after the first {completedRounds === 1 ? 'round' : `${completedRounds} rounds`}
                    </Typography>
                </>
            )}
        </Box>
    );
};

module.exports.propTypes = {
    status: T.oneOf(['in-progress', 'finished']).isRequired,
    score: T.shape({
        team: T.shape({
            a: T.arrayOf(T.number).isRequired,
            b: T.arrayOf(T.number).isRequired
        }).isRequired,
        player: T.objectOf(T.arrayOf(T.arrayOf(T.number)).isRequired).isRequired
    })
};

internals.sum = (x, y) => x + y;

internals.flat = (arr) => {

    return arr.reduce((a, b) => [].concat(a).concat(b), []);
};

internals.englishList = (arr) => {

    if (arr.length === 0) {
        return '';
    }

    if (arr.length === 1) {
        return `${arr[0]}`;
    }

    if (arr.length === 2) {
        return `${arr[0]} and ${arr[1]}`;
    }

    return arr.slice(0, -1).join(', ') + `, and ${arr[arr.length - 1]}`;
};

internals.InlineAvatar = Styled.span`
    display: inline-flex;
    width: 24px;
    height: 24px;
    font-size: 1rem;
    margin: 0 ${({ theme }) => theme.spacing(1)}px;
`;
