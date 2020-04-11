const Redux = require('redux');
const ReduxDevtools = require('redux-devtools-extension/logOnlyInProduction');
const MiddleEnd = require('strange-middle-end');
const App = require('./app');
const Model = require('./model');
const Router = require('./router');

exports.create = (options = {}) => {

    const middleEnd = MiddleEnd.create({
        mods: () => ({
            app: App(middleEnd, options),
            model: Model(middleEnd, options),
            router: Router(middleEnd, options)
        }),
        createStore: (reducer, { router }) => {

            const middleware = [
                MiddleEnd.middleware.thunk,
                options.logErrors && MiddleEnd.middleware.errorLogger,
                router.middleware
            ];

            return Redux.createStore(reducer, ReduxDevtools.composeWithDevTools(
                Redux.applyMiddleware(...middleware.filter(Boolean))
            ));
        }
    });

    return middleEnd;
};
