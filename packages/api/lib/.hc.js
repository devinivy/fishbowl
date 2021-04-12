'use strict';

const HauteCouture = require('@hapipal/haute-couture');

module.exports = {
    plugins: HauteCouture.amendment('plugins', {
        recursive: false
    }),
    'plugins/late': HauteCouture.amendment('plugins', {
        after: ['auth/strategies']
    }),
    subscriptions: {
        place: 'subscriptions',
        list: true,
        signature: ['path', 'options'],
        method: 'subscription',
        after: ['plugins/late', 'services'],    // Since services are registering events
        example: {
            path: '',
            options: {}
        }
    }
};
