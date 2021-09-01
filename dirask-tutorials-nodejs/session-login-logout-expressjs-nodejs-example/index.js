const express = require('express');
const session = require('express-session');

const {createRestApi} = require('./backend/api.js');
const {createViewApi} = require('./frontend/api.js');

const port = 3000;           // port used to run server
const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    name: 'SESSION_ID',      // cookie name stored in the web browser
    secret: 'my_secret',     // helps to protect session
    cookie: {
      maxAge: 30 * 86400000, // 30 * (24 * 60 * 60 * 1000) = 30 * 86400000 => session is stored 30 days
    }
  })
);

createRestApi(app);
createViewApi(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
