const React = require('react');
const T = require('prop-types');
const { default: Styled, css } = require('styled-components');
const { default: Box } = require('@material-ui/core/Box');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: Fab } = require('@material-ui/core/Fab');
const { default: List } = require('@material-ui/core/List');
const { default: ListItem } = require('@material-ui/core/ListItem');
const { default: ListItemText } = require('@material-ui/core/ListItemText');
const { default: ListItemAvatar } = require('@material-ui/core/ListItemAvatar');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: InitializedIcon } = require('@material-ui/icons/NewReleases');
const { default: InProgressIcon } = require('@material-ui/icons/Timer');
const { default: FinishedIcon } = require('@material-ui/icons/Done');
const { default: AddIcon } = require('@material-ui/icons/Add');
const { default: Amber } = require('@material-ui/core/colors/amber');
const { default: LightGreen } = require('@material-ui/core/colors/lightGreen');
const Link = require('../../../components/Link');
const Types = require('../../../components/types');

const internals = {};

module.exports = function HomePage({ games }) {

    const { StatusAvatar, CornerFab } = internals;

    return (
        <Box
            width={{ xs: '100%', sm: 600 }}
            mx='auto'
            boxShadow={1}
            bgcolor='background.paper'
            position='relative'
        >
            <Box mx={2} mt={2}>
                <Typography variant='h5'>Games</Typography>
            </Box>
            <List>
                {games.map(({ id, name, status, players }) => {

                    return (
                        <ListItem key={id} button component={Link} to={`/game/${id}`}>
                            <ListItemAvatar>
                                <StatusAvatar status={status}>
                                    {status === 'initialized' && <InitializedIcon />}
                                    {status === 'in-progress' && <InProgressIcon />}
                                    {status === 'finished' && <FinishedIcon />}
                                </StatusAvatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={name}
                                secondary={players.join(', ')}
                            />
                        </ListItem>
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

internals.StatusAvatar = Styled(Avatar)`
    ${({ status }) => {

        if (status === 'in-progress') {
            return css`
                background-color: ${Amber[500]};
            `;
        }

        if (status === 'initialized') {
            return css`
                background-color: ${LightGreen[500]};
            `;
        }
    }}
`;

internals.CornerFab = Styled(Fab)`
    position: absolute;
    bottom: ${({ theme }) => theme.spacing(2)}px;
    right: ${({ theme }) => theme.spacing(2)}px;
`;
