const React = require('react');

const Context = React.createContext();

exports.Provider = Context.Provider;

exports.useMiddleEnd = function useMiddleEnd() {

    return React.useContext(Context);
};
