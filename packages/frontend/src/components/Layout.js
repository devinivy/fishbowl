const React = require('react');
const T = require('prop-types');
const Header = require('./Header');
const ErrorFallback = require('./ErrorFallback');
const LoadingFallback = require('./LoadingFallback');
const { default: Styled } = require('styled-components');
const { default: ErrorBoundary } = require('react-error-boundary');

const internals = {};

module.exports = ({ children, location }) => {

    const { Container, AppContainer } = internals;

    return (
        <AppContainer>
            <Header />
            <Container>
                <ErrorBoundary key={location.key} FallbackComponent={ErrorFallback}>
                    <React.Suspense fallback={<LoadingFallback />}>
                        {children}
                    </React.Suspense>
                </ErrorBoundary>
            </Container>
        </AppContainer>
    );
};

module.exports.propTypes = {
    children: T.any,
    location: T.shape({
        key: T.string
    })
};

internals.Container = Styled.div`
    display: flex;
    flex: 1;
    @media (min-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
        padding-left: ${({ theme }) => theme.spacing(3)}px;
        padding-right: ${({ theme }) => theme.spacing(3)}px;
    }
`;

internals.AppContainer = Styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;
