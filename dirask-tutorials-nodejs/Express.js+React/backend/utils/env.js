// Source:
//
//     https://dirask.com/posts/Node-js-read-env-file-custom-solution-D7oyOD


const fs = require('fs');


const NEWLINE_EXPRESSION = /\r?\n/g;

// Syntax:
//
//   %NODE_CONSTANT_NAME%    - constant defined in application source code
//   $LOCAL_VARIABLE_NAME$   - variable defined in `.env` file
//   *GLOBAL_VARIABLE_NAME*  - variable defined in `process.env` object
//
const REFERENCE_EXPRESSION = /%%|%([^%*$]+)%|%|\*\*|\*([^%*$]+)\*|\*|\$\$|\$([^%*$]+)\$|\$/g;

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

const readVariables = exports.readVariables = (path = ENV_PATH, constants = {}) => {
    const text = fs.readFileSync(path, 'utf-8');
    const variables = [];
    const environment = process.env;
    iterateVariables(text, (name, value, index) => {
        const action = (match, group1, group2, group3) => {
            switch (match) {
                case '%': throw new Error(`Incorrect '%' character usage in 'name=${value}' line (line number: ${index + 1}).`);
                case '*': throw new Error(`Incorrect '*' character usage in 'name=${value}' line (line number: ${index + 1}).`);
                case '$': throw new Error(`Incorrect '$' character usage in 'name=${value}' line (line number: ${index + 1}).`);
                case '%%': return '%';
                case '**': return '*';
                case '$$': return '$';
                default:
                    switch (match[0]) {
                        case '%':
                            {
                                const constant = constants[group1];
                                if (constant) {
                                    return constant();
                                }
                                throw new Error(`Unknown '%${group1}%' environment constant.`);
                            }
                        case '*':
                            {
                                const variable = environment[group2];
                                if (variable == null) {  // null or undefined
                                    throw new Error(`Unknown '*${group2}*' environment variable.`);
                                }
                                return variable;
                            }
                        case '$':
                            {
                                const variable = variables[group3];
                                if (variable == null) {  // null or undefined
                                    throw new Error(`Unknown '$${group3}$' environment variable.`);
                                }
                                return variable;
                            }
                        default:
                            throw new Error(`Unknown constant/variable type.`);
                    }
            }
        };
        variables[name] = value.replace(REFERENCE_EXPRESSION, action);
    });
    return variables;
};

const initializeVariables = exports.initializeVariables = (path = ENV_PATH, constants = null) => {
    const variables = readVariables(path, constants);
    const keys = Object.keys(variables);
    for (const key of keys) {
        process.env[key] = variables[key];
    }
};