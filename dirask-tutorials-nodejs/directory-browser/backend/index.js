const fs = require('fs/promises');
const path = require('path');
const express = require('express');

const {initializeVariables, ENV_PATH} = require('./utils/env');
const {readItems} = require('./utils/directory');
const {tryGet, getWildcard} = require('./utils/request');
const {createContext} = require('./utils/frontend');


// configuration

const ENV_CONSTANTS = exports.ENV_CONSTANTS = {
    __dirname: () => __dirname,
    __filename: () => __filename
};

initializeVariables(ENV_PATH, ENV_CONSTANTS);

// application

const app = express();

// configuration

const SERVER_LISTENING_PORT = process.env.SERVER_LISTENING_PORT ?? 8080;
const SHARED_DIRECTORY_PATH = process.env.SHARED_DIRECTORY_PATH ? path.normalize(process.env.SHARED_DIRECTORY_PATH) : path.resolve(__dirname, 'share');

const context = createContext(app);

context.useResources();

// backend routes

const DOWNLOAD_OPTIONS = {
    root: SHARED_DIRECTORY_PATH,
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
        const entryPath = path.resolve(SHARED_DIRECTORY_PATH, requestPath);
        const entryStat = await fs.stat(entryPath);
        if (entryStat.isDirectory()) {
            const directoryItems = await readItems(entryPath)
            response.json({
                result: true,
                directories: directoryItems.directories,
                files: directoryItems.files
            });
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
    console.error(`Method: ${request.method}, URL: ${request.protocol}://${request.hostname}:${SERVER_LISTENING_PORT}${request.path}`);
    response
        .status(500)
        .json({
            result: false,
            message: 'Internal server error!'
        });
    next(error);
})

// running

app.listen(SERVER_LISTENING_PORT, () => console.log(`Server is listening on port ${SERVER_LISTENING_PORT}.`));