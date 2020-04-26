'use strict';

// Load modules

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Server = require('../server');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Deployment', () => {

    it('registers the back- and frontend plugins.', async () => {

        const server = await Server.deployment();

        expect(server.registrations['fishbowl-api']).to.exist();
        expect(server.registrations['fishbowl-frontend']).to.exist();
    });
});
