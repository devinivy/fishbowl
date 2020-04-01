const React = require('react');
const T = require('prop-types');
const { default: Styled } = require('styled-components');
const { useTheme } = require('@material-ui/core/styles');
const { default: useMediaQuery } = require('@material-ui/core/useMediaQuery');
const { default: Box } = require('@material-ui/core/Box');
const { default: Paper } = require('@material-ui/core/Paper');

const internals = {};

module.exports = function GameSection({ children, bgcolor, ...others }) {

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { ColorPaper } = internals;

    return (
        <Box mx={{ xs: 1, sm: 0 }} my={{ xs: 1, sm: 2 }} {...others}>
            <ColorPaper bgcolor={bgcolor} variant={smUp ? 'outlined' : 'elevation'} elevation={1} square={!smUp}>
                <Box p={2}>
                    {children}
                </Box>
            </ColorPaper>
        </Box>
    );
};

module.exports.propTypes = {
    bgcolor: T.string,
    children: T.node
};

internals.ColorPaper = Styled(Paper)`
    background-color: ${({ bgcolor }) => bgcolor};
`;
