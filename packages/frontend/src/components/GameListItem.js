const React = require('react');
const T = require('prop-types');
const { default: Styled, css } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: InitializedIcon } = require('@material-ui/icons/NewReleases');
const { default: InProgressIcon } = require('@material-ui/icons/Timer');
const { default: FinishedIcon } = require('@material-ui/icons/Done');
const { default: Amber } = require('@material-ui/core/colors/amber');
const { default: LightGreen } = require('@material-ui/core/colors/lightGreen');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Orange } = require('@material-ui/core/colors/orange');
const { default: FormatRelative } = require('date-fns/formatRelative');
const Types = require('./types');
const { useAppTime } = require('../containers/useAppTime');

const internals = {};

module.exports = function GameListItem({ game, now, children, ...others }) {

    const getTime = useAppTime();
    const { status, createdAt, players } = game;
    const { StatusAvatar, statusInfo } = internals;

    return (
        <ListItem {...others}>
            <ListItemAvatar title={statusInfo[status].description}>
                <StatusAvatar status={status}>
                    {statusInfo[status].icon}
                </StatusAvatar>
            </ListItemAvatar>
            <ListItemText
                primary={FormatRelative(createdAt, now || getTime()).toLowerCase()}
                secondary={players.map((p, i) => (

                    <>
                        <Box
                            component='span'
                            title={`${p.nickname}${(status === 'initialized') ? (p.status === 'ready' ? ': ready' : ': not ready') : ''}`}
                            color={(status === 'initialized') && (p.status === 'ready' ? Teal[500] : Orange[500])}
                        >
                            {p.nickname}
                        </Box>
                        {i !== players.length - 1 ? ', ' : ''}
                    </>
                ))}
            />
            {children}
        </ListItem>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired,
    now: T.instanceOf(Date).isRequired,
    children: T.node
};

internals.statusInfo = {
    initialized: {
        icon: <InitializedIcon />,
        description: 'starting soon',
        color: LightGreen[500]
    },
    'in-progress': {
        icon: <InProgressIcon />,
        description: 'in progress',
        color: Amber[500]
    },
    finished: {
        icon: <FinishedIcon />,
        description: 'ended',
        color: ''
    }
};

internals.StatusAvatar = Styled(Avatar)`
    ${({ status }) => {

        const { statusInfo } = internals;

        if (statusInfo[status].color) {
            return css`
                background-color: ${statusInfo[status].color};
            `;
        }
    }}
`;
