const Layout = require('../components/Layout');
const NotFoundPage = require('../components/NotFoundPage');
const NotFoundHelpers = require('./helpers/not-found');
const HomePage = require('./home/containers/HomePage');
const GamePage = require('./game/components/GamePage');

module.exports = [
    {
        path: '/',
        component: NotFoundHelpers.withNotFoundPage(Layout, NotFoundPage),
        childRoutes: [
            {
                path: '/',
                component: HomePage,
                exact: true
            },
            {
                path: '/game/:id',
                component: GamePage,
                exact: true
            },
            NotFoundHelpers.CatchAllRoute
        ]
    }
];
