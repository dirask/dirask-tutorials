const fs = require('fs/promises');
const path = require('path');
const express = require('express');

const {initializeVariables, ENV_PATH} = require('./utils/env');
const {readItems} = require('./utils/directory');
const {tryGet, getWildcard} = require('./utils/request');
const {createContext} = require('./utils/frontend');


// configuration

const BACKEND_SERVER_PORT = 8080;  // backend server will be strted on 8080

const ENV_CONSTANTS = exports.ENV_CONSTANTS = {
    __dirname: () => __dirname,
    __filename: () => __filename
};

// application

initializeVariables(ENV_PATH, ENV_CONSTANTS);

const app = express();

// configuration

const SHARE_PATH = process.env.SHARE_PATH ? path.normalize(process.env.SHARE_PATH) : path.resolve(__dirname, 'share');

const context = createContext(app, {
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

context.useResources();

// backend routes

const DOWNLOAD_OPTIONS = {
    root: SHARE_PATH,
    dotfiles: 'allow'
};

// Express.js - wildcard path parameter

tryGet(
    app,
    [
        '/api/directory',
        '/api/directory/*'
    ],
    async (request, response) => {
        const requestPath = getWildcard(request);
        const entryPath = path.resolve(SHARE_PATH, requestPath);
        const entryStat = await fs.stat(entryPath);
        if (entryStat.isDirectory()) {
            try {
                const directoryItems = await readItems(entryPath)
                response.json({
                    result: true,
                    directories: directoryItems.directories,
                    files: directoryItems.files
                });
            } catch (error) {
                if (error.code === 'ENOENT') {
                    response.json({
                        result: false,
                        message:'Incorrect directory path.'
                    });
    
                } else {
                    throw error;
                }
            }
            return;
        }
        if (entryStat.isFile()) {
            response.sendFile(requestPath, DOWNLOAD_OPTIONS);
            return;
        }
        throw new Error('Forbidden request path.');
    }
);

// frontend routes

context.mapRoutes();

// error routes

app.use((error, request, response, next) => {
    console.error(`Method: ${request.method}, URL: ${request.protocol}://${request.hostname}:${BACKEND_SERVER_PORT}${request.path}`);
    response
        .status(500)
        .json({
            result: false,
            message: 'Internal server error!'
        });
    next(error);
})

// running

app.listen(BACKEND_SERVER_PORT, () => console.log(`Server is listening on port ${BACKEND_SERVER_PORT}.`));
