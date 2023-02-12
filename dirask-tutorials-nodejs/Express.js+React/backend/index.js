const express = require('express');

const {initializeVariables, ENV_PATH} = require('./utils/env');
const {createContext} = require('./utils/frontend');


// configuration

const ENV_CONSTANTS = exports.ENV_CONSTANTS = {
    __dirname: () => __dirname,   // index.js directory path
    __filename: () => __filename  // index.js file path
};

initializeVariables(ENV_PATH, ENV_CONSTANTS);

const SERVER_LISTENING_PORT = process.env['backend.SERVER_LISTENING_PORT'] ?? 8080;

// application

const app = express();

const context = createContext(app, {
/*
    developmentModeEnabled: JSON.parse(process.env.DEVELOPMENT_MODE_ENABLED ?? 'false'),
    backend: {
        frontendRoutePath: '/'  // React frontend application will be served from '/'
                                // Nested routes will be mapped automatically also (only if there will be not defined backend route path equivalent that may override frontend route path).
                                // e.g. http://localhost:8080/ will return React frontend
    },
    frontend: {
        productionBuildPath: path.join(__dirname, '../frontend/build'),
        productionIndexPath: path.join(__dirname, '../frontend/build/index.html'),
        developmentServerUrl: 'http://localhost:3000/'  // URL that indicates React application under development
    }
*/
});

// ... put more express configurations here ...

context.useResources();

// backend routes (e.g. you can use `/api/` prefix to avoid frontend route paths overriding)

// e.g.
app.get('/api/users', (request, response) => {
    response.json(['John', 'Kate', 'Matt']);
});

// ... put more backend routes here ...

// frontend routes

context.mapRoutes();

// running

app.listen(SERVER_LISTENING_PORT, () => console.log(`Server is listening on port ${SERVER_LISTENING_PORT}.`));