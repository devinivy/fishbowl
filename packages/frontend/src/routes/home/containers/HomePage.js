const React = require('react');
const HomePage = require('../components/HomePage');

module.exports = function HomePageContainer() {

    return (
        <HomePage
            games={[
                { id: 1, name: 'sattydat night', status: 'initialized', players: ['harper', 'hannah', 'devin', 'ashton'] },
                { id: 2, name: 'thursday', status: 'in-progress', players: ['harper', 'ashton', 'devin'] },
                { id: 3, name: 'tuesday night', status: 'finished', players: ['harper', 'devin', 'ashton'] }
            ]}
        />
    );
};
