# fishbowl-deployment
> The REST and realtime backend powering fishbowl

## What is this?
This is a [hapijs](https://hapi.dev/) service composing both [fishbowl-frontend](../frontend) and [fishbowl-api](../api) into a single server. Each of fishbowl-frontend and fishbowl-api followed the principle of [server-plugin separation](https://hapipal.com/best-practices/server-plugin-separation) with support from the [hapi pal boilerplate](https://github.com/hapipal/boilerplate), so we have the choice to deploy them together or separately.  The purpose of fishbowl-deployment is create a simple deployment, specifically for Docker containerization.

## Getting Started
### Installation
This service is best installed by running `lerna bootstrap` from the project root.

### Requirements
This service only requires it be run on node v12.  The fishbowl-frontend project should already be built with `API_URL=/api` (i.e. `API_URL=/api lerna run build --scope fishbowl-frontend`).

### Deployment
Once installed you may start the server by running `npm start` within this directory or `lerna run start --stream --scope fishbowl-deployment` from the project root.

For production it is recommended to deploy this service using the [Dockerfile](../../Dockerfile) located at the root of the project.  This Dockerfile will build the frontend and ensure the frontend and backend are configured correctly together.

### Configuration
This service persists data in an in-memory SQLite database by default.  If you would like to persist data to disk you may provide an environment variable `SQLITE_DB_FILE`.

When deploying using the Dockerfile at the root of the project, you will need to [provide a volume](https://docs.docker.com/storage/volumes/) if you would like persistent storage for SQLite.  The volume needs to be able to read and write to `/date/app.db` within the container.
