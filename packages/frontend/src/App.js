const React = require('react');
const T = require('prop-types');
const HotLoader = require('react-hot-loader/root');
const ReactRedux = require('react-redux');
const Styled = require('styled-components');
const { default: CreateMuiTheme } = require('@material-ui/core/styles/createMuiTheme');
const { default: MuiThemeProvider } = require('@material-ui/styles/ThemeProvider');
const { default: CssBaseline } = require('@material-ui/core/CssBaseline');
const StrangeRouter = require('strange-router');
const { ConnectedRouter } = require('connected-react-router');
const { default: ErrorBoundary } = require('react-error-boundary');
const ReactMiddleEnd = require('./middle-end/react');
const ErrorFallback = require('./components/ErrorFallback');
const Routes = require('./routes');

module.exports = ({ middleEnd, theme = CreateMuiTheme(), Router = ConnectedRouter, ...routerProps }) => {

    return (
        <Styled.ThemeProvider theme={theme}>
            <MuiThemeProvider theme={theme}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <CssBaseline />
                    <ReactMiddleEnd.Provider value={middleEnd}>
                        <ReactRedux.Provider store={middleEnd.store}>
                            <Router {...routerProps}>
                                <StrangeRouter.Routes routes={Routes} />
                            </Router>
                        </ReactRedux.Provider>
                    </ReactMiddleEnd.Provider>
                </ErrorBoundary>
            </MuiThemeProvider>
        </Styled.ThemeProvider>
    );
};

module.exports.propTypes = {
    middleEnd: T.shape({
        store: T.object.isRequired
    }).isRequired,
    theme: T.object,
    Router: T.elementType
};

module.exports = HotLoader.hot(module.exports);
