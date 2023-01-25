const db = require('./db');
const utils = require('./utils');

const getUserId$1 = (session) => {
    return session.LOGGED_USER_ID ?? null;
};

const getUserId$2 = (request, response) => {
    const session = request.session;
    return getUserId$1(session);
};

const checkUser$1 = (session, callback) => {
    if (session.LOGGED_USER_ID == null) {
        callback('You are not logged in.', null);
    } else {
        db.fetchUser(session.LOGGED_USER_ID, (error, data) => {
            if (error) {
                utils.logError(error);
                callback('Server internal error.', null);
            } else {
                if (data.length > 0) {
                    const entry = data[0];
                    callback(null, entry);
                } else {
                    delete session.LOGGED_USER_ID;
                    callback('You are not logged in.', null);
                }
            }
        });
    }
};

const checkUser$2 = (request, response, callback) => {
    const session = request.session;
    checkUser$1(session, callback);
};

const loginUser$1 = (session, data, callback) => {
    if (session.LOGGED_USER_ID == null) {
        db.checkUser(data.username, data.password, (error, data) => {
            if (error) {
                utils.logError(error);
                callback('Server internal error.', null);
            } else {
                if (data.length > 0) {
                    const entry = data[0];
                    session.LOGGED_USER_ID = entry.id;
                    callback(null, entry);
                } else {
                    callback('Incorrect user credentials.', null);
                }
            }
        });
    } else {
        callback('You are already logged in.', null);
    }
};

const loginUser$2 = (request, response, callback) => {
    const session = request.session;
    const payload = request.body;
    loginUser$1(session, payload, callback);
};

const logoutUser$1 = (session, callback) => {
    if (session.LOGGED_USER_ID == null) {
        callback('You are not logged in.', null);
    } else {
        delete session.LOGGED_USER_ID;
        callback(null, {});
    }
};

const logoutUser$2 = (request, response, callback) => {
    const session = request.session;
    logoutUser$1(session, callback);
};

const registerUser$1 = (session, data, callback) => {
    db.insertUser(data, (error, data) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                callback('User already exists.', null);
            } else {
                utils.logError(error);
                callback('Server internal error.', null);
            }
        } else {
            if (data.affectedRows > 0) {
                session.LOGGED_USER_ID = data.insertId;
                callback(null, {});
            } else {
                callback('User creation problem.', null);
            }
        }
    });
};

const registerUser$2 = (request, response, callback) => {
    const session = request.session;
    const payload = request.body;
    registerUser$1(session, payload, callback);
};

module.exports = {
    getUserId$1,
    getUserId$2,
    checkUser$1,
    checkUser$2,
    loginUser$1,
    loginUser$2,
    logoutUser$1,
    logoutUser$2,
    registerUser$1,
    registerUser$2
};