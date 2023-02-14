const fs = require('fs');
const http = require('http');
const https = require('https');

const {parseBoolean} = require('./boolean');


/**
 * Creates HTTP/HTTPS server runner using `.env` file or `config` object.
 * 
 * @param {*} app    express application
 * @param {*} config application configuration
 *                   e.g.
 *                   {
 *                       serverListeningPort: 8080,
 *                       serverHttpsEnabled: true,
 *                       serverKeyPath: 'key.pem',
 *                       serverCertificatePath: 'cert.pem
 *                   }
 * 
 * @returns          object that lets to manage server (e.g. server.start())
 */
const createServer = exports.createServer = (app, config = {}) => {
    const serverListeningPort = config.serverListeningPort ?? parseInt(process.env.SERVER_LISTENING_PORT ?? '8080');
    const serverHttpsEnabled = config.serverHttpsEnabled ?? parseBoolean(process.env.SERVER_HTTPS_ENABLED ?? 'true');
    if (serverHttpsEnabled) {
        const serverKeyPath = config.serverKeyPath ?? process.env.SERVER_KEY_PATH ?? 'key.pem';
        const serverCertificatePath = config.serverCertificatePath ?? process.env.SERVER_CERTIFICATE_PATH ?? 'cert.pem';
        const credentials = {
            key: fs.readFileSync(serverKeyPath, 'utf8'),
            cert: fs.readFileSync(serverCertificatePath, 'utf8'),
        };
        const server = https.createServer(credentials, app);
        return {
            start: (callback) => {
                server.listen(serverListeningPort, () => callback?.('HTTPS', serverListeningPort));
            }
        };
    } else {
        const server = http.createServer(app);
        return {
            start: (callback) => {
                server.listen(serverListeningPort, () => callback?.('HTTP', serverListeningPort));
            }
        };
    }
};