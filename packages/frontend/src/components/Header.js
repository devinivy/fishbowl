const React = require('react');
const { NavLink } = require('react-router-dom');
const { default: Styled } = require('styled-components');
const { default: Typography } = require('@material-ui/core/Typography');
const { default: AppBar } = require('@material-ui/core/AppBar');
const { default: Toolbar } = require('@material-ui/core/Toolbar');
const { default: Button } = require('@material-ui/core/Button');

const internals = {};

module.exports = () => {

    const { Link, SiteTitle } = internals;

    return (
        <AppBar position='static'>
            <Toolbar>
                <SiteTitle>
                    <NavLink exact to='/'>
                        <span role='img' aria-label='droplets'>💦</span>
                        {' '}Fishbowl{' '}
                        <span role='img' aria-label='fish'>🐟</span>
                    </NavLink>
                </SiteTitle>
                <Link exact to='/'>Home</Link>
            </Toolbar>
        </AppBar>
    );
};

internals.Link = Styled(Button).attrs({ component: NavLink, color: 'inherit' })`
    &.active {
        font-weight: bold;
        text-decoration: underline;
    }
`;

internals.SiteTitle = Styled(Typography).attrs({ variant: 'h6' })`
    flex-grow: 1;
    a {
        text-decoration: none;
        :visited {
            color: unset;
        }
    }
`;
