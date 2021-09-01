const mysql = require('mysql');

const database = require('./database.js');

const createRestApi = app => {
    app.post('/user/login', async (request, response) => {
        if (request.session.userId) {
            response.json({result: 'ERROR', message: 'User already logged in.'});
        } else {
            const user = {
                username: request.body.username,
                password: request.body.password
            };
            const connection = await database.createConnection();
            try {
                const result = await connection.query(`
                    SELECT id 
                    FROM users 
                    WHERE 
                            username=${mysql.escape(user.username)}
                        AND password=${mysql.escape(user.password)}
                    LIMIT 1
                `);
                if (result.length > 0) {
                    const user = result[0];
                    request.session.userId = user.id;
                    response.json({result: 'SUCCESS', userId: user.id});
                } else {
                    response.json({result: 'ERROR', message: 'Indicated username or/and password are not correct.'});
                }
            } catch(e) {
                console.error(e);
                response.json({result: 'ERROR', message: 'Request operation error.'});
            } finally {
                await connection.end();
            }
        }
    });
      
    app.get('/user/logout', async (request, response) => {
        if (request.session.userId) {
            delete request.session.userId;
            response.json({result: 'SUCCESS'});
        } else {
            response.json({result: 'ERROR', message: 'User is not logged in.'});
        }
    });
};

module.exports = {
    createRestApi
};