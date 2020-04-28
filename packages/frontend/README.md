# fishbowl-frontend
> The reactive SPA frontend powering fishbowl

## What is this?
This is a [React](https://reactjs.org/) single-page app built using [strangeluv](https://github.com/BigRoomStudios/strangeluv) to power the fishbowl application.  It utilizes [Redux](https://redux.js.org/) plus [strange-middle-end](https://github.com/BigRoomStudios/strange-middle-end) as a stateful data layer, with the [nes](https://hapi.dev/module/nes/) realtime websocket client integrated at its center.  The look and feel of the app is largely informed by [material-ui](https://material-ui.com/), further customized and laid-out with [styled-components](https://styled-components.com/).

This service may be deployed standalone or treated as a package and pulled-in as a dependency.  When it's used as a dependency, it takes the form of a hapi plugin and may be registered on any existing hapi deployment.  This is exactly how `fishbowl-deployment` makes use of this service, deploying both the fishbowl frontend and backend together on a single server.

## Getting Started
### Installation
This service is best installed by running `lerna bootstrap` from the project root.

### Requirements
When deployed standalone or built, the frontend requires it be run on node v12.  When this package is used as a dependency, hapi v19 should be installed in the project as a peer.

### Deployment
Once installed you may start the development server by running `npm start` within this directory or `lerna run start --stream --scope fishbowl-frontend` from the project root.  A static build may be created with `npm run build` (or `lerna run build --stream --scope fishbowl-frontend`), and that build may be served with `npm run serve`.  Note that the fishbowl application has its own deployment in the `fishbowl-deployment` package, which includes this frontend service: the instructions above are just for standalone deployments or for development purposes.

When this package is used as a dependency (as it is in `fishbowl-deployment`), the frontend service is consumed as a hapi plugin.

### Configuration
This service persists data to the fishbowl-api over websockets, so it needs to know the websocket URL at which the API may be found.  In order to do that, supply the environment variable `API_URL` at build time (`npm run build`) or when starting the development server (`npm start`).  The URL may be an absolute path (really, a URI) assuming the origin host (e.g. `/api`), or a URL
 including the websocket protocol (e.g. `ws://localhost:4000`).  If you would like to use a .env file for configuration, `cp config/.env-keep config/.env` and fill-in whatever environment variables that you'd like.  The entrypoint to build configuration lives in `config/index.js`.

When this package is consumed as a hapi plugin it requires no plugin options.

## Extras

### Core Dependencies

 - *UI* - `react` `react-dom`
 - *Styles & Design* - `styled-components` `@material-ui/core` `@material-ui/styles`
 - *State* - `redux` `react-redux` `redux-thunk` `strange-middle-end` `normalizr` `immer`
 - *Routing* - `react-router` `react-router-dom` `connected-react-router` `strange-router` `history`
 - *Errors* - `react-error-boundary` `error-overlay-webpack-plugin`
 - *Builds* - `webpack` `html-webpack-plugin` `copy-webpack-plugin` `file-loader` `@babel/core` `babel-preset-react-app`
 - *Production server* - `@hapi/hapi` `@hapi/inert`
 - *Development server* - `webpack-dev-server`
 - *HMR* - `react-hot-loader` `@hot-loader/react-dom`
 - *Tests* - `jest` `@testing-library/react`
 - *Lint* - `eslint` `@hapi/eslint-config-hapi` `eslint-config-standard-react`

### Scripts

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:3000` via webpack-dev-server.|
|`build`|Compile the application to `build/` for production.|
|`build:dev`|Compile the application to `build/`, overriding `NODE_ENV` to "development".|
|`clean`|Remove the `build/` folder.|
|`test`|Run tests with Jest.|
|`serve`|Run production server.|
|`serve:dev`|Run production server, overriding `NODE_ENV` to "development".|
|`lint`|Lint all javascript in the repository.|
