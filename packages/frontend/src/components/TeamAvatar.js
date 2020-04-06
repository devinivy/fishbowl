const { default: Styled } = require('styled-components');
const { default: Avatar } = require('@material-ui/core/Avatar');
const { default: Teal } = require('@material-ui/core/colors/teal');
const { default: Red } = require('@material-ui/core/colors/red');

exports.A = Styled(Avatar).attrs({ children: 'A' })`
    background-color: ${Teal[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Teal[50])};
    border: ${({ theme, outline }) => outline && `.25px solid ${theme.palette.common.black}`};
`;

exports.B = Styled(Avatar).attrs({ children: 'B' })`
    background-color: ${Red[50]};
    color: ${({ theme }) => theme.palette.getContrastText(Red[50])};
    border: ${({ theme, outline }) => outline && `.25px solid ${theme.palette.common.black}`};
`;
