"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const resolver_1 = require("../resolver");
const getOutputName = (file, folder) => {
    const split = file.replace(path_1.resolve(`${process.cwd()}${folder ? `/${folder}` : ''}`), '')
        .split('/')
        .filter((slug) => !!slug);
    const nameSplit = split[split.length - 1].split('.');
    nameSplit.pop();
    split[split.length - 1] = nameSplit.join('.');
    while (split.length > 1 && split[split.length - 1] === 'index') {
        split.pop();
    }
    return split.join('/');
};
exports.createInputs = (folder, extensions, suffix, excludes) => (resolver_1.resolver(folder, false, extensions).reduce((accumulator, files) => ([
    ...accumulator,
    ...(typeof files === 'string' ? [files] : files),
]), []).reduce((accumulator, file) => (Object.assign(Object.assign({}, accumulator), (excludes.indexOf(path_1.resolve(file)) >= 0 ? {} : {
    [`${getOutputName(file, folder)}${suffix}`]: path_1.resolve(file),
}))), {}));
