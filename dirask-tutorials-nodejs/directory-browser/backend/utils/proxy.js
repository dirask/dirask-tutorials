// Source:
//
//     https://dirask.com/snippets/Node-js-Express-js-create-proxy-forward-request-and-response-of-HTTP-protocol-Dl6rGj


const path = require('path');
const http = require('http');

const createPath = (aPath, bPath, search) => {
    let result = path.posix.join(aPath ?? '', bPath ?? '');
    if (search) {
        result += '?' + search;
    }
    return result;
};

const createProxy = exports.createProxy = (expressApp, proxyPath, destinationUrl, proxyAgent = null) => {
    const parsedUrl = new URL(destinationUrl);
    if (parsedUrl.search) {
        throw new Error('Incorrect destination URL (query component is not premitted).');
    }
    if (proxyAgent == null) {
        proxyAgent = new http.Agent({
            keepAlive: true,
            maxSockets: 100
        });
    }
    const routePath = path.posix.join(proxyPath, '*');
    expressApp.all(routePath, (srcRequest, srcResponse) => {
        const srcParams = srcRequest.params;
        const srcQuery = srcRequest.query;
        const dstRequest = http.request({
            agent: proxyAgent,
            protocol: parsedUrl.protocol,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: createPath(parsedUrl.pathname, srcParams[0], new URLSearchParams(srcQuery)),
            method: srcRequest.method,
            headers: srcRequest.headers
        });
        dstRequest.on('response', (dstResponse) => {
            if (dstResponse.statusCode) {
                srcResponse.status(dstResponse.statusCode);
            }
            if (dstResponse.headers) {
                srcResponse.set(dstResponse.headers);
            }
            dstResponse.pipe(srcResponse);
        });
        dstRequest.on('error', (e) => {
            console.error(e);
            srcResponse
                .status(500)
                .send(`Endpoint request error! Check if ${destinationUrl} endpoint is working.`);
        });
        srcRequest.pipe(dstRequest);
    });
};