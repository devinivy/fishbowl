'use strict';

const HauteCouture = require('@hapipal/haute-couture');
const Package = require('../package.json');

exports.plugin = {
    pkg: Package,
    register: async (app, options) => {

        // Custom plugin code can go here

        await HauteCouture.compose(app, options);
    }
};
