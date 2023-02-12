const fs = require('fs/promises');
const path = require('path');

exports.readStat = async (...paths) => {
    return await fs.stat(path.resolve(...paths));
};