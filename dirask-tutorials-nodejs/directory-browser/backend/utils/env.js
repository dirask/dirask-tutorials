// -----------------------------------------------------------------------------
// Source: https://dirask.com/posts/Node-js-read-env-file-custom-solution-D7oyOD
// -----------------------------------------------------------------------------

const fs = require('fs');

const NEWLINE_EXPRESSION = /\r?\n/g;
const CONSTANT_EXPRESSION = /%%|%([^%]+)%|%/g;

const ENV_PATH = exports.ENV_PATH = '.env';


const iterateVariables = exports.iterateVariables = (text, callback) => {
    const lines = text.split(NEWLINE_EXPRESSION);
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if (line) {
            const index = line.indexOf('=');
            if (index !== -1) {
                const name = line.substring(0, index);
                if (name) {
                    const value = line.substring(index + 1);
                    callback(name, value, i);
                }
            }
        }
    }
};

const readVariables = exports.readVariables = (path = ENV_PATH, constants = null) => {
    const text = fs.readFileSync(path, 'utf-8');
    const variables = [];
    if (constants) {
        iterateVariables(text, (name, value, index) => {
            const action = (match, group) => {
                switch (match) {
                    case '%':
                        throw new Error(`Incorrect '%' character usage in 'name=${value}' line (line number: ${index + 1}).`);
                    case '%%':
                        return '%';
                    default:
                        const constant = constants[group];
                        if (constant) {
                            return constant();
                        }
                        throw new Error(`Unknown '%${group}%' environment constant.`);
                }
            };
            variables[name] = value.replace(CONSTANT_EXPRESSION, action);
        });
    } else {
        iterateVariables(text, (name, value) => {
            variables[name] = value;
        });
    }
    return variables;
};

const initializeVariables = exports.initializeVariables = (path = ENV_PATH, constants = null) => {
    const variables = readVariables(path, constants);
    const keys = Object.keys(variables);
    for (const key of keys) {
        process.env[key] = variables[key];
    }
};