const Layout = require('../components/Layout');
const NotFoundPage = require('../components/NotFoundPage');
const NotFoundHelpers = require('./helpers/not-found');
const HomePage = require('./home/containers/HomePage');

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
            NotFoundHelpers.CatchAllRoute
        ]
    }
];
