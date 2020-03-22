const React = require('react');
const HomePage = require('../components/HomePage');

module.exports = function HomePageContainer() {

    return (
        <HomePage
            games={[
                { id: 1, status: 'initialized', players: ['harper', 'hannah', 'devin', 'ashton'], createdAt: new Date() },
                { id: 2, status: 'in-progress', players: ['harper', 'ashton', 'devin'], createdAt: new Date(Date.now() - 1000000) },
                { id: 3, status: 'finished', players: ['harper', 'devin', 'ashton'], createdAt: new Date(Date.now() - 100000000) }
            ]}
        />
    );
};
