const mysql = require('mysql');

const db = mysql.createPool({
    debug: false,
    host: 'localhost',  // '127.0.0.1'
    user: 'root',
    password: 'root',
    database: 'demo_db',
    connectionLimit: 100
});

const fetchUser = (id, callback) => {
    const query = 'SELECT `id`, `username`, `password`, `email` FROM `users` WHERE `id`=? LIMIT 1';
    const values = [id];
    db.query(query, values, callback);
};

const checkUser = (username, password, callback) => {
    const query = 'SELECT `id` FROM `users` WHERE `username`=? AND `password`=? LIMIT 1';
    const values = [username, password];
    db.query(query, values, callback);
};

const insertUser = (data, callback) => {
    const query = 'INSERT INTO `users` (`username`, `password`, `email`) VALUES (?, ?, ?)';
    const values = [data.username, data.password, data.email];
    db.query(query, values, callback);
};

module.exports = {
    fetchUser,
    checkUser,
    insertUser
};