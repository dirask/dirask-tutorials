const session = require('express-session');

const {parseBoolean} = require('./boolean');
const {tryGet, tryPost} = require('./request');


const createAuthentication = exports.createAuthentication = (app, config = {}) => {
    const siteAuthenticationEnabled = config.siteAuthenticationEnabled ?? parseBoolean(process.env.SITE_AUTHENTICATION_ENABLED ?? 'false');
    const siteAuthenticationUsername = config.siteAuthenticationUsername ?? process.env.SITE_AUTHENTICATION_USERNAME;
    const siteAuthenticationPassword = config.siteAuthenticationPassword ?? process.env.SITE_AUTHENTICATION_PASSWORD;
    if (siteAuthenticationEnabled) {
        if (!siteAuthenticationUsername) {
            throw new Error('SITE_AUTHENTICATION_USERNAME variable is not configured!');
        }
        if (!siteAuthenticationPassword) {
            throw new Error('SITE_AUTHENTICATION_PASSWORD variable is not configured!');
        }
        const sessionSecretKey = config.sessionSecretKey ?? process.env.SESSION_SECRET_KEY;
        if (!sessionSecretKey) {
            throw new Error('SESSION_SECRET_KEY variable is not configured!');
        }
        const sessionMaxAge = config.sessionMaxAge ?? parseInt(process.env.SESSION_MAX_AGE ?? '2592000000'); // 30 days by default
        return {
            isEnabled: () => {
                return true;
            },
            useSession: () => {
                app.use(
                    session({
                        name: 'SESSION_ID', // cookie name stored in the web browser
                        secret: sessionSecretKey,
                        cookie: {
                            maxAge: sessionMaxAge,
                            httpOnly: true
                        },
                        saveUninitialized: true
                    })
                );
            },
            mapRoutes: () => {
                tryGet(app, '/api/user/check', async (request, response) => {
                    const session = request.session;
                    if (session.IS_USER_LOGGED) {
                        response.json({
                            result: true,
                            mode: 'USER'
                        });
                    } else {
                        response.json({
                            result: false,
                            message: 'You are not logged in.'
                        });
                    }
                });
                tryPost(app, '/api/user/login', async (request, response) => {
                    const session = request.session;
                    if (session.IS_USER_LOGGED) {
                        response.json({
                            result: false,
                            message: 'You are already logged in.'
                        });
                    } else {
                        const body = request.body;
                        if (body.username === siteAuthenticationUsername && body.password === siteAuthenticationPassword) {
                            session.IS_USER_LOGGED = true;
                            response.json({
                                result: true
                            });
                        } else {
                            response.json({
                                result: false,
                                message: 'Incorrect user credentials.'
                            });
                        }
                    }
                });
                tryGet(app, '/api/user/logout', async (request, response) => {
                    const session = request.session;
                    if (session.IS_USER_LOGGED) {
                        session.IS_USER_LOGGED = false;
                        response.json({
                            result: true
                        });
                    } else {
                        response.json({
                            result: false,
                            message: 'You are not logged in.'
                        });
                    }
                });
            },
            isAuthenticated: (request, response) => {
                const session = request.session;
                return session.IS_USER_LOGGED;
            }
        }
    } else {
        return {
            isEnabled: () => {
                return false;
            },
            useSession: () => {
                // Nothing here ...
            },
            mapRoutes: () => {
                tryGet(app, '/api/user/check', async (request, response) => {
                    response.json({
                        result: true,
                        mode: 'GUEST'
                    });
                });
            },
            isAuthenticated: () => {
                return true;
            }
        }
    }
};