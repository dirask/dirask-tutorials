const path = require('path');
const express = require('express');

const {createProxy} = require('./proxy');


const createContext = exports.createContext = (expressApp, config = {}) => {
    const backendConfig = config.backend ?? {};
    const frontendConfig = config.frontend ?? {};
    const developmentModeEnabled = config.developmentModeEnabled ?? JSON.parse(process.env.DEVELOPMENT_MODE_ENABLED ?? 'false'); 
    const frontendRoutePath = backendConfig.frontendRoutePath ?? process.env['backend.FRONTEND_ROUTE_PATH'] ?? '/';
    const developmentServerUrl = frontendConfig.developmentServerUrl ?? process.env['frontend.DEVELOPMENT_SERVER_URL'] ?? 'http://localhost:3000/';
    const productionBuildPath = path.normalize(frontendConfig.productionBuildPath ?? process.env['frontend.PRODUCTION_BUILD_PATH'] ?? 'public/');
    const productionIndexPath = path.normalize(frontendConfig.productionIndexPath ?? process.env['frontend.PRODUCTION_INDEX_PATH'] ?? path.join(productionBuildPath, 'index.html'));
    return {
        useResources: () => {
            if (developmentModeEnabled === false) {
                expressApp.use(
                    express.static(productionBuildPath, {
                        index: false
                    })
                );
            }
        },
        mapRoutes: () => {
            if (developmentModeEnabled === false) {
                const frontendRoutesPath = path.posix.join(frontendRoutePath, '*');
                expressApp.all(frontendRoutesPath, (request, response) => {
                    response.sendFile(productionIndexPath);
                });
            } else {
                createProxy(expressApp, frontendRoutePath, developmentServerUrl);
            }
        }
    };
};