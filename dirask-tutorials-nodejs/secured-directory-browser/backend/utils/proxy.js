// Source:
//
//     https://dirask.com/snippets/Node-js-Express-js-create-proxy-forward-request-and-response-of-HTTP-protocol-Dl6rGj


const path = require('path');
const http = require('http');

const createExpression = require('path-to-regexp');  // this package in correct version is automatically attached by Express.js to construct routes expressions


const joinPaths = (...parts) => {
    return path.posix.join(...parts);
};

const findWildcard = (expression, path) => {
    const matches = expression.exec(path);
    if (matches.length > 0) {
        return matches[matches.length - 1];
    }
    return null;
};

const createComposition = (aPath, bPath, bSearch) => {
    let path = joinPaths(aPath ?? '', bPath ?? '');
    if (bSearch) {
        const search = bSearch.toString();
        if (search) {
            return path + '?' + search;
        }
    }
    return path;
};

/**
 * Adds HTTP proxy from `${proxyPath}/*` to `${dstUrl}/*` in express application.
 * 
 * @param {*} expressApp express application
 * @param {String} proxyPath path that we want to redirect, e.g. '/my-application'
 * @param {String} dstUrl URL that we want to handle, e.g. 'http://localhost:3000'
 * @param {*} proxyAgent HTTP aget that is used to make requests
 */
const createProxy = exports.createProxy = (expressApp, proxyPath, dstUrl, proxyAgent = null) => {
    const parsedUrl = new URL(dstUrl);
    if (parsedUrl.search) {
        throw new Error('Incorrect destination URL (query component is not premitted).');
    }
    if (proxyAgent == null) {
        proxyAgent = new http.Agent({
            keepAlive: true,
            maxSockets: 100
        });
    }
    const routePath = joinPaths(proxyPath, '*');
    const routeExpression = createExpression(routePath);
    expressApp.all(routePath, (srcRequest, srcResponse) => {
        const srcPath = srcRequest.url;
        const srcQuery = srcRequest.query;
        const srcWildcard = findWildcard(routeExpression, srcPath);  // finds raw wildcard parameter - not encoded what is very important!!!
        const dstRequest = http.request({
            agent: proxyAgent,
            protocol: parsedUrl.protocol,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: createComposition(parsedUrl.pathname, srcWildcard, new URLSearchParams(srcQuery)),
            query: [],
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
                .send(`Endpoint request error! Check if ${dstUrl} endpoint is working.`);
        });
        srcRequest.pipe(dstRequest);
    });
};