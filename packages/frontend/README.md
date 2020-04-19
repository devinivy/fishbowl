# fishbowl-frontend

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

## Requirements
* node `12.x.x`

## Getting Started

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
