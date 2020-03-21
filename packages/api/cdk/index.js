'use strict';

const { App } = require('@aws-cdk/core');
const FargateImageStack = require('./stack');
const Package = require('../package.json');

const app = new App();

new FargateImageStack(app, Package.name, {
    domainName: app.node.tryGetContext('domainName')
}, {
    env: {
        region: process.env.CDK_DEFAULT_REGION,
        account: process.env.CDK_DEFAULT_ACCOUNT
    }
});

app.synth();
