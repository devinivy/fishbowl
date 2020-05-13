# fishbowl
> A realtime game built with [React](https://reactjs.org/) and [hapijs](https://hapi.dev/)

Fishbowl is a turn-based word game typically played in-person.  This application adapts the in-person [gameplay](#for-gameplay) so that we can instead play remotely while we are quarantined at home!  It also is meant to serve as a fairly in-depth example of an application built with React and especially with [hapi pal](https://hapipal.com/).

This repository is comprised of three packages:
 - [fishbowl-api](./packages/api) - a REST and realtime backend built with [hapijs](https://hapi.dev/) and [hapi pal](https://hapipal.com/).
 - [fishbowl-frontend](./packages/frontend) - a reactive SPA frontend built with [React](https://reactjs.org/).
 - [fishbowl-deployment](./packages/deployment) - a unified deployment of fishbowl-api and fishbowl-frontend, leveraging each as a hapi plugin.

# Quick Start
There is a lot more information [in the readmes](#package-table-of-contents) of the various packages, but if you're just looking to give this a try, here is how you get started.

## For Development
```sh
node -v # v12.x.x
npm install
npx lerna bootstrap
API_URL=/api npx lerna run build --scope fishbowl-frontend
npx lerna run start --stream --scope fishbowl-deployment
```

## For Production
Utilizing the [Dockerfile](./Dockerfile) in the root of this project is the recommended solution for deploying Fishbowl in a consistent, reproducible way.  This Dockerfile will build the frontend and ensure the frontend and backend are configured correctly together. You will need to [provide a volume](https://docs.docker.com/storage/volumes/) if you would like persistent storage for SQLite.  The volume needs to be able to read and write to `/date/app.db` within the container.

```sh
docker build -t fishbowl .
touch fishbowl.db # Persistent storage
docker run --volume $PWD/fishbowl.db:/app/data.db fishbowl
```

## For Gameplay
At the time of writing the rules gameplay is not written down in this repository, but [this video](https://www.youtube.com/watch?v=QO-2s4CEd1w) is a good explainer.

The only requisites aside from the Fishbowl web application are:
  - that each player have their own screen, and
  - that the players congregate over video chat so that they can interact with each other visually (and with sound!).

# Package Table of Contents

- [fishbowl-api](./packages/api/README.md)
  * [What is this?](./packages/api/README.md#what-is-this)
  * [Getting Started](./packages/api/README.md#getting-started)
    + [Installation](./packages/api/README.md#installation)
    + [Requirements](./packages/api/README.md#requirements)
    + [Deployment](./packages/api/README.md#deployment)
    + [Configuration](./packages/api/README.md#configuration)
  * [Architecture](./packages/api/README.md#architecture)

- [fishbowl-frontend](./packages/frontend/README.md)
  * [What is this?](./packages/frontend/README.md#what-is-this)
  * [Getting Started](./packages/frontend/README.md#getting-started)
    + [Installation](./packages/frontend/README.md#installation)
    + [Requirements](./packages/frontend/README.md#requirements)
    + [Deployment](./packages/frontend/README.md#deployment)
    + [Configuration](./packages/frontend/README.md#configuration)
  * [Extras](./packages/frontend/README.md#extras)
    + [Core Dependencies](./packages/frontend/README.md#core-dependencies)
    + [Scripts](./packages/frontend/README.md#scripts)

- [fishbowl-deployment](./packages/deployment/README.md)
  * [What is this?](./packages/deployment/README.md#what-is-this)
  * [Getting Started](./packages/deployment/README.md#getting-started)
    + [Installation](./packages/deployment/README.md#installation)
    + [Requirements](./packages/deployment/README.md#requirements)
    + [Deployment](./packages/deployment/README.md#deployment)
    + [Configuration](./packages/deployment/README.md#configuration)
