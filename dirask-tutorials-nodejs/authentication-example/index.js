const path = require('path');
const express = require('express');
const session = require('express-session');

const utils = require('./utils');
const service = require('./service');

// configuration

const app = express();

app.use(
    session({
        name: 'SESSION_ID',         // cookie name stored in the web browser
        secret: 'my_secret',        // it is good to use random string here to protect session
        cookie: {
            maxAge: 30 * 86400000,  // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session is stored 30 days
        }
    })
);

app.use(express.json());
app.use(express.static('public'));

// routes

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/api/user/check', (request, response) => {
    service.checkUser$2(request, response, (error, data) => {
        if (error) {
            utils.sendError(response, error);
        } else {
            response.json({
                success: true,
                message: 'You are logged in.',
                user: {
                    id: data.id,
                    username: data.username,
                 /* password: data.password, */
                    email: data.email
                }
            });
        }
    });
});

app.post('/api/user/login', (request, response) => {
    service.loginUser$2(request, response, (error, data) => {
        if (error) {
            utils.sendError(response, error);
        } else {
            utils.sendSuccess(response, 'Login operation succeed.');
        }
    });
});

app.post('/api/user/logout', (request, response) => {
    service.logoutUser$2(request, response, (error, data) => {
        if (error) {
            utils.sendError(response, error);
        } else {
            utils.sendSuccess(response, 'Logout operation succeed.');
        }
    });
});

app.post('/api/user/register', (request, response) => {
    service.registerUser$2(request, response, (error, data) => {
        if (error) {
            utils.sendError(response, error);
        } else {
            utils.sendSuccess(response, 'Register operation succeed.');
        }
    });
});

app.post('/api/some-protected-action', (request, response) => {
    if (service.getUserId$2(request, response)) {
        // Put action logic here ...
    } else {
        // Send back error here ...
    }
});

// running

app.listen(8080, () => console.log('Server is listening on port 8080.'));