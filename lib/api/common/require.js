"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const requireFolder = path_1.resolve(`${__dirname}/../../`);
const path = `${requireFolder}/require.js`;
const pathMin = `${requireFolder}/require.min.js`;
exports.getContent = (minified) => {
    const file = minified ? pathMin : path;
    try {
        return fs_extra_1.readFileSync(file).toString();
    }
    catch (error) {
        console.log(`File "${file}" cannot be read.`);
        throw error;
    }
};
