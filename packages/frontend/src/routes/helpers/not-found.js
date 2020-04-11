const React = require('react');
const T = require('prop-types');
const { Redirect, useLocation } = require('react-router-dom');

exports.NotFound = function NotFound() {

    const location = useLocation();

    return (
        <Redirect
            to={{
                ...location,
                state: {
                    ...location.state,
                    notFound: true
                }
            }}
        />
    );
};

exports.CatchAllRoute = {
    path: '',
    component: exports.NotFound
};

exports.withNotFoundPage = (RouteComponent, NotFoundComponent) => {

    return class RouteComponentWithNotFoundPage extends React.Component {

        static propTypes = {
            location: T.shape({
                state: T.shape({
                    notFound: T.bool
                })
            })
        }

        render() {

            const { location } = this.props;

            return location.state && location.state.notFound ?
                <RouteComponent {...this.props} children={<NotFoundComponent {...this.props} />} /> :
                <RouteComponent {...this.props} />;
        }
    };
};
