'use strict';

const Path = require('path');
const { Stack } = require('@aws-cdk/core');
const { HostedZone } = require('@aws-cdk/aws-route53');
const { Vpc, InstanceType, InstanceClass, InstanceSize, SubnetType } = require('@aws-cdk/aws-ec2');
const { Cluster, ContainerImage, Secret } = require('@aws-cdk/aws-ecs');
const { ApplicationProtocol } = require('@aws-cdk/aws-elasticloadbalancingv2');
const { DockerImageAsset } = require('@aws-cdk/aws-ecr-assets');
const { ApplicationLoadBalancedFargateService } = require('@aws-cdk/aws-ecs-patterns');
const { DatabaseInstance, DatabaseInstanceEngine } = require('@aws-cdk/aws-rds');

module.exports = class FargateImageStack extends Stack {
    constructor(scope, id, config, props) {

        super(scope, id, props);

        const { domainName } = config || {};

        if (!domainName) {
            throw new Error('Stack is missing some configuration');
        }

        // NOTE an existing vpc could also be passed-in or looked-up using Vpc.fromLookup()
        const vpc = new Vpc(this, 'Vpc', {
            maxAzs: 2   // Min required by Fargate
        });

        // NOTE could have a non-master user and a separate db,
        // but that would require manually creating the user and db in postgres,
        // which poses a challenge because it is deployed in a private subnet.

        const db = new DatabaseInstance(this, 'PgDatabase', {
            vpc,
            engine: DatabaseInstanceEngine.POSTGRES,
            engineVersion: '11',
            instanceClass: InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO),
            databaseName: 'cdk_app',
            masterUsername: 'app',
            vpcPlacement: {
                subnetType: SubnetType.PRIVATE
            }
        });

        // This is acceptable for now because we know we're on one of our private subnets
        db.connections.allowDefaultPortFromAnyIpv4();

        const cluster = new Cluster(this, 'Cluster', { vpc });

        const zone = HostedZone.fromLookup(this, 'Zone', {
            // For example, a.b.c.bigroomstudios.com -> bigroomstudios.com
            domainName: domainName.split('.').slice(-2).join('.')
        });

        // Builds image locally and places in ECR
        const imageAsset = new DockerImageAsset(this, 'ServiceImageAsset', {
            directory: Path.join(__dirname, '..'),
            file: 'server/Dockerfile',
            target: 'release'
            // Below is a workaround for aws/aws-cdk#2070, if CDK's interpretation of the dockerignore causes
            // the whole project to be ignored when deciding if any files have changed, and in turn whether to rebuild:
            // extraHash: Date.now()
        });

        new ApplicationLoadBalancedFargateService(this, 'FargateService', {
            cluster,
            protocol: ApplicationProtocol.HTTPS,
            domainName,
            domainZone: zone,
            taskImageOptions: {
                image: ContainerImage.fromDockerImageAsset(imageAsset),
                containerPort: 3000,
                secrets: {
                    // Shows-up as an env variable formatted in JSON: { host, port, dbname, username, password }
                    // In the future we should be able to pull just the password out as a secret value and avoid
                    // the special env var. See aws/containers-roadmap#385 aws/containers-roadmap#510.
                    DB_SECRET: Secret.fromSecretsManager(db.secret)
                }
            }
        });
    }
};
