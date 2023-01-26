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








// const path = require('path');
// const express = require('express');

// const proxy = require('./proxy');

// // configuration

// const DEVELOPMENT_MODE = JSON.parse(process.env.DEVELOPMENT_MODE ?? 'false');

// const BACKEND_SERVER_PORT = 8080;  // backend server will be strted on 8080
// const PROXY_FRONTEND_PATH = '/';   // React frontend application will be served from '/'
//                                    // e.g. http://localhost:8080/ will return React frontend

// // if DEVELOPMENT_MODE === false
// //
// const PRODUCTION_FRONTEND_DIRECTORY = path.join(__dirname, '../frontend/build');          // path to frontend application build directory (*.js, *.css, index.html, etc. files)
// // const PRODUCTION_FRONTEND_DIRECTORY = path.join(__dirname, 'public');                  // path to frontend application build directory (*.js, *.css, index.html, etc. files)
// //                                    UNIX:      /path/to/frontend/directory
// //                                    Windows: C:\path\to\frontend\directory
// const PRODUCTION_INDEX_PATH = path.join(PRODUCTION_FRONTEND_DIRECTORY, 'index.html');  // path to frontend application index.html file

// // if DEVELOPMENT_MODE === true
// //
// const DEVELOPMENT_FRONTEND_URL = 'http://localhost:3000/';  // URL that indicates React application under development

// // application

// const app = express();

// // ...

// if (DEVELOPMENT_MODE === false) {
//     app.use(
//         express.static(PRODUCTION_FRONTEND_DIRECTORY, {
//             index: false
//         })
//     );
// }

// // backend routes

// // ...

// // frontend routes

// if (DEVELOPMENT_MODE === false) {
//     const routePath = path.posix.join(PROXY_FRONTEND_PATH, '*');
//     app.all(routePath, (request, response) => {
//         response.sendFile(PRODUCTION_INDEX_PATH);
//     });
// } else {
//     proxy.createProxy(app, PROXY_FRONTEND_PATH, DEVELOPMENT_FRONTEND_URL);
// }

// // running

// app.listen(BACKEND_SERVER_PORT, () => console.log(`Server is listening on port ${BACKEND_SERVER_PORT}.`));