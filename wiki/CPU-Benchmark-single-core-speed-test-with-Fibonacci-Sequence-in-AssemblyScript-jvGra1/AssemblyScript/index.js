const fs = require('fs');
const loader = require('@assemblyscript/loader');

const imports = { };
const path = __dirname + '/build/optimized.wasm';
const source = fs.readFileSync(path);
const instance = loader.instantiateSync(source, imports);

const result = instance.exports.test();

console.log(`Time: ${0.001 * result}s`);