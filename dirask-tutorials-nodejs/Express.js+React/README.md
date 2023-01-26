# Express.js + React on the same port 

This project was created to show how run Express.js backend and React frontend applications on the same server (using the same port and process).

Project contains logic that lets to run application in production and development mode.

## Installation

Before, we will start using applications we should install dependencies. 

In the `backend/` and `frontend` directories, run:

```
npm ci install
```

## Development

Provided backend logic lets to display frontend application and reload its source code on changes.

In the `frontend` directory, run:

```
npm run start
```

In the `backend/` directory, run:

```
npm run start:development
```

In the web browser just open backend application using:

```
http://localhost:8080
```

> Note: you can change configuration in `backend/index.js` file.

## Production

Provided backend logic lets to display frontend application as attached resources without additional process.

In the `frontend` directory, run:

```
npm run build
```

In the `backend/` directory, run:

```
npm run start:production
```

In the web browser just open backend application using:

```
http://localhost:8080
```

> Note: you can change configuration in `backend/index.js` file.