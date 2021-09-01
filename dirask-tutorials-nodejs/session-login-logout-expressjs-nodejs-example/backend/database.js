const mysql = require('mysql');

const config = {
  user: 'root',
  password: 'root',
  database: 'my_database',
  host: 'localhost',
  port: 3306,
  multipleStatements: true,
};

const createConnection = () => {
  const connection = mysql.createConnection(config);

  const query = sql => {
    return new Promise((resolve, reject) => {
      connection.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  const end = () => {
    return new Promise((resolve, reject) => {
      connection.end(error => {
        if (error) {
          reject();
        } else {
          resolve();
        }
      })
    });
  };

  return new Promise((resolve, reject) => {
    connection.connect(error => {
      if (error) {
        reject(error);
      } else {
        resolve({query, end});
      }
    });
  })
};

module.exports = {
  createConnection
};
