'use strict';

const Toys = require('toys');
const Avocat = require('avocat');

module.exports = Toys.onPreResponse((request, h) => {

    const { response: error } = request;

    if (!error.isBoom) {
        return h.continue;
    }

    return Avocat.rethrow(error, { return: true, includeMessage: false }) || error;
});
