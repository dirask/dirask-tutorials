const path = require('path');
const express = require('express');

const frontend = require('./utils/frontend');

// configuration

const BACKEND_SERVER_PORT = 8080;  // backend server will be strted on 8080

// application

const app = express();

// configuration

const context = frontend.createContext(app, {
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

app.listen(BACKEND_SERVER_PORT, () => console.log(`Server is listening on port ${BACKEND_SERVER_PORT}.`));
