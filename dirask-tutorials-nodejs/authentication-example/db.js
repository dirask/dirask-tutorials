const mysql = require('mysql');

const db = mysql.createPool({
    debug: false,
    host: 'localhost',    // '127.0.0.1'
    user: 'root',         // use your username !!!
    password: 'root',     // use your password !!!
    database: 'demo_db',
    connectionLimit: 10
});

const fetchUser = (id, callback) => {
    const query = 'SELECT `id`, `username`, `password`, `email` FROM `users` WHERE `id`=? LIMIT 1';
    const values = [id];
    db.query(query, values, callback);
};

const checkUser = (username, password, callback) => {
    // Note: do not store plain passwords, e.g. you can use https://github.com/kelektiv/node.bcrypt.js
    const query = 'SELECT `id` FROM `users` WHERE `username`=? AND `password`=? LIMIT 1';
    const values = [username, password];
    db.query(query, values, callback);
};

const insertUser = (data, callback) => {
    // Note: do not store plain passwords, e.g. you can use https://github.com/kelektiv/node.bcrypt.js
    const query = 'INSERT INTO `users` (`username`, `password`, `email`) VALUES (?, ?, ?)';
    const values = [data.username, data.password, data.email];
    db.query(query, values, callback);
};

module.exports = {
    fetchUser,
    checkUser,
    insertUser
};