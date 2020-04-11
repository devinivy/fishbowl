const Nes = require('@hapi/nes/lib/client');
const Helpers = require('../helpers');

module.exports = class FishbowlClient extends Nes.Client {

    constructor(m, { api }) {

        super(api);

        this.m = m;
    }

    async request(options) {

        const { m } = this;

        await Helpers.waitFor(m, m.selectors.app.connection, {
            success: ['connected', 'disconnected']
        });

        return await super.request(options);
    }
};
