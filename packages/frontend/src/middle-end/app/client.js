const Nes = require('@hapi/nes/lib/client');
const Helpers = require('../helpers');

module.exports = class FishbowlClient extends Nes.Client {

    constructor(m, { api }) {

        const { location: { protocol, host } } = window;

        const url = api && (
            api.startsWith('ws://') || api.startsWith('wss://') ?
                api :
                protocol.replace('http', 'ws') + '//' + host + '/' + api.replace(/^\//, '')
        );

        super(url);

        this.m = m;
        this.prefix = !api || api.startsWith('ws://') || api.startsWith('wss://') ?
            '' :
            '/' + api.replace(/^\//, '');
    }

    async request(options) {

        const { m, prefix } = this;

        await Helpers.waitFor(m, m.selectors.app.connection, {
            success: ['connected', 'disconnected']
        });

        return await super.request(typeof options === 'string' ?
            (options.startsWith('/') ? `${prefix}${options}` : options) : {
                ...options,
                path: options.path && `${prefix}${options.path}`
            }
        );
    }
};
