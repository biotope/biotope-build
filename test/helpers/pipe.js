'use strict';

const vs = require('vinyl-string');
const map = require('map-stream'); // Lets us write in-line functions in our pipe

/*
 * Get transformed contents of a string
 *
 * @param {string} input - String contents of the "file"
 * @param {string} path  - The "path" of the "file"
 * @param {function} func - The lazypipe that will be used to transform the input
 *
 * @returns {string} Vinyl file representing the original `input` and `path`, transformed by the `func`
 */
module.exports.fromString = (input, path, func) => {
    return new Promise((res, rej) => {
        let contents = false; // So we can grab the content later

        const vFile = vs(input, { path }); // Equivalent to path: path. ES6 Object Literal Shorthand Syntax

        vFile
            .pipe(func()) // Call the function we're going to pass in
            .pipe(map((file, cb) => {
                contents = file;
                cb(null, file);
            }))
            .on('error', e => {
                rej(e);
            })
            .on('end', () => {
                res(contents);
            });
    });
};