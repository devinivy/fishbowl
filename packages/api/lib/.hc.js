'use strict';

const HauteCouture = require('haute-couture');

const defaultManifest = HauteCouture.manifest.create({}, true);

const getItemByPlace = (place) => {

    return defaultManifest.find((amendment) => place === amendment.place);
};

module.exports = {
    recursive: true,
    add: [
        {
            ...getItemByPlace('plugins'),
            recursive: false
        },
        {
            ...getItemByPlace('plugins'),
            place: 'plugins/late',
            after: ['auth/strategies']
        },
        {
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
    ]
};
