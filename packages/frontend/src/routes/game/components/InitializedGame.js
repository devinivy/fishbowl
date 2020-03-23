const React = require('react');
const { default: Box } = require('@material-ui/core/Box');
const { default: Button } = require('@material-ui/core/Button');
const { default: TextField } = require('@material-ui/core/TextField');
const GameListItem = require('../../../components/GameListItem');
const Types = require('../../../components/types');

module.exports = function InitializedGame({ game }) {

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
                    py={{ xs: 2, sm: 1 }}
                    bgcolor='secondary.main'
                    alignItems='center'
                    justifyContent='center'
                    flexBasis={200}
                    flexGrow={{ xs: 1, sm: 0 }}
                    flexShrink={1}
                    borderRadius={{ xs: 0, sm: 'borderRadius' }}
                >
                    <Box mr={2}>
                        <Button variant='outlined'>join</Button>
                    </Box>
                    <Box>
                        <TextField fullWidth placeholder='nickname' />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

module.exports.propTypes = {
    game: Types.game.isRequired
};
