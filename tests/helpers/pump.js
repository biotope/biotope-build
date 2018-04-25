const vs = require('vinyl-string');
const map = require('map-stream');

module.exports.pumpFromString = (input, path, tasks) => {
    return new Promise((res, rej) => {
        const pump = require('pump');
        let contents = false;
        const vFile = vs(input, { path });

        tasks.unshift(vFile);
        tasks.push(map((file, cb) => {
            contents = file;
            cb(null, file);
        }));

        pump(tasks, e => e ? rej(e) : res(contents));
    });
};