const fs = require('fs');
const loader = require('@assemblyscript/loader');

const imports = { };
const path = __dirname + '/build/optimized.wasm';
const source = fs.readFileSync(path);
const instance = loader.instantiateSync(source, imports);

const pointer = instance.exports.test();
const array = instance.exports.__getInt64Array(pointer);

const time = Number(array[0]);   // time in ms
const result = Number(array[1]); // b variable

console.log(`Time: ${0.001 * time}s`);
console.log(`Result: ${result}`);