'use strict';

module.exports = {
    plugins: {
        options: {
            auth: {
                route: {
                    strategy: 'player',
                    mode: 'optional'
                }
            }
        }
    }
};
