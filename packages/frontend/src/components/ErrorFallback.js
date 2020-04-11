const React = require('react');
const { default: Box } = require('@material-ui/core/Box');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: Button } = require('@material-ui/core/Button');

module.exports = () => {

    return (
        <Box p={4}>
            <Typography component='h1' variant='h6' gutterBottom>
                Oops! Something went wrong.
            </Typography>
            <Typography>
                You can try{' '}
                <Button
                    variant='outlined'
                    size='small'
                    color='primary'
                    onClick={() => window.location.reload()}
                >
                    reloading the page
                </Button>.
            </Typography>
        </Box>
    );
};
