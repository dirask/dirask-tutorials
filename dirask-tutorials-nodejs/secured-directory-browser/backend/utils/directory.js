const fs = require('fs/promises');

const {readStat} = require('./node');


/**
 * Reads directories and files located under indicated path.
 * 
 * @param {String} path directory path
 * 
 * @returns directories and files
 */
exports.readItems = async (path) => {
    const directories = [];
    const files = [];
    for (const item of await fs.readdir(path)) {
        const stat = await readStat(path, item);
        if (stat.isDirectory()) {
            directories.push({
                name: item,
                modified: stat.mtime.toISOString()
            });
        }
        if (stat.isFile()) {
            files.push({
                name: item,
                size: stat.size,
                modified: stat.mtime.toISOString()
            });
        }
    }
    return {directories, files};
};