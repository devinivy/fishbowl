const React = require('react');
const { default: Styled } = require('styled-components');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Red } = require('@material-ui/core/colors/red');

exports.A = Styled(({ outline, ...others }) => <Avatar children='A' {...others} />)`
    background-color: ${Teal[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Teal[50])};
    border: ${({ theme, outline }) => outline && `.25px solid ${theme.palette.common.black}`};
`;

exports.B = Styled(({ outline, ...others }) => <Avatar children='B' {...others} />)`
    background-color: ${Red[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Red[50])};
    border: ${({ theme, outline }) => outline && `.25px solid ${theme.palette.common.black}`};
`;
