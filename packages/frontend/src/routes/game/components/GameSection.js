const React = require('react');
const T = require('prop-types');
const { useTheme } = require('@material-ui/core/styles');
const { default: useMediaQuery } = require('@material-ui/core/useMediaQuery');
const { default: Box } = require('@material-ui/core/Box');
const { default: Paper } = require('@material-ui/core/Paper');

module.exports = function GameSection({ children, ...others }) {

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Box mx={{ xs: 1, sm: 0 }} my={{ xs: 1, sm: 2 }} {...others}>
            <Paper variant={smUp ? 'outlined' : 'elevation'} elevation={1} square={!smUp}>
                <Box p={2}>
                    {children}
                </Box>
            </Paper>
        </Box>
    );
};

module.exports.propTypes = {
    children: T.node
};
