const path = require('path');
const express = require('express');

const proxy = require('./proxy');


const createContext = exports.createContext = (expressApp, config = {}) => {
    const backendConfig = config.backend ?? {};
    const frontendConfig = config.frontend ?? {};
    const developmentModeEnabled = config.developmentModeEnabled ?? false; 
    const frontendRoutePath = backendConfig.frontendRoutePath ?? '/';
    const productionBuildPath = frontendConfig.productionBuildPath ?? 'public/';
    const productionIndexPath = frontendConfig.productionIndexPath ?? path.join(productionBuildPath, 'index.html');
    const developmentServerUrl = frontendConfig.developmentServerUrl ?? 'http://localhost:3000/';
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
                proxy.createProxy(expressApp, frontendRoutePath, developmentServerUrl);
            }
        }
    };
};