const fs = require('fs');
const http = require('http');
const https = require('https');


/**
 * Creates HTTP/HTTPS server runner using `.env` file or `config` object.
 * 
 * @param {*} app    express application
 * @param {*} config application configuration
 *                   e.g.
 *                   {
 *                       listeningPort: 8080,
 *                       httpsEnabled: true,
 *                       keyPath: 'key.pem',
 *                       certificatePath: 'cert.pem
 *                   }
 * 
 * @returns          object that lets to manage server (e.g. server.start())
 */
const createServer = exports.createServer = (app, config = {}) => {
    const listeningPort = config.listeningPort ?? JSON.parse(process.env.SERVER_LISTENING_PORT ?? '8080');
    const httpsEnabled = config.httpsEnabled ?? JSON.parse(process.env.SERVER_HTTPS_ENABLED ?? 'true');
    if (httpsEnabled) {
        const keyPath = config.keyPath ?? process.env.SERVER_KEY_PATH ?? 'key.pem';
        const certificatePath = config.certificatePath ?? process.env.SERVER_CERTIFICATE_PATH ?? 'cert.pem';
        const credentials = {
            key: fs.readFileSync(keyPath, 'utf8'),
            cert: fs.readFileSync(certificatePath, 'utf8'),
        };
        const httpsServer = https.createServer(credentials, app);
        return {
            start: (callback) => {
                httpsServer.listen(listeningPort, () => callback?.('HTTPS', listeningPort));
            }
        };
    } else {
        const httpServer = http.createServer(app);
        return {
            start: (callback) => {
                httpServer.listen(listeningPort, () => callback?.('HTTP', listeningPort));
            }
        };
    }
};