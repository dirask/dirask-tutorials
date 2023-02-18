const fs = require('fs');
const path = require('path');

/**
 * Reads directories and files located under indicated path.
 * 
 * @param {String} directoryPath directory path
 * 
 * @returns directories and files
 */
const readItems = exports.readItems = async (directoryPath) => {
    const directories = [];
    const files = [];
    for (const itemName of await fs.promises.readdir(directoryPath)) {
        const itemPath = path.join(directoryPath, itemName);
        if (fs.existsSync(itemPath)) {  // to prevent situation when soft link indicates to unexisting path
            const itemStat = await fs.promises.stat(itemPath);
            if (itemStat.isDirectory()) {
                directories.push({
                    name: itemName,
                    modified: itemStat.mtime.toISOString()
                });
                continue;
            }
            if (itemStat.isFile()) {
                files.push({
                    name: itemName,
                    size: itemStat.size,
                    modified: itemStat.mtime.toISOString()
                });
                continue;
            }
        }
    }
    return {directories, files};
};