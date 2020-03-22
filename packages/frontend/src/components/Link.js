const React = require('react');
const { Link } = require('react-router-dom');

module.exports = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);
