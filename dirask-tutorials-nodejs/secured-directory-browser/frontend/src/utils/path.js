// Source:
//
//     https://dirask.com/snippets/JavaScript-join-URL-path-removes-duplicated-slashes-jvJMXj


// Joins URL paths removing duplicate slashes.
//
// Arguments:
//   ...parts  URL paths that will be combined
//
// Result: combined paths
//
export const joinPath = (...parts) => {
    let result = '';
    let separator = '';
    for (const part of parts) {
        if (part) {
            if (result) {
                separator = '/';
            }
            for (const entry of part) {
                if (entry === '/') {
                    separator = entry;
                } else {
                    result += separator;
                    result += entry;
                    separator = '';
                }
            }
        }
    }
    if (separator) {
        result += separator;
    }
    return result;
};