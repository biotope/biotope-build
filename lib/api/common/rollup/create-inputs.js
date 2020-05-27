"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInputs = void 0;
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
exports.createInputs = (config, legacy) => {
    const suffix = config.legacy && legacy ? config.legacy.suffix : '';
    const excludes = resolver_1.resolver(config.exclude.map((folder) => `${config.project}/${folder}`), false, config.extLogic);
    return resolver_1.resolver(config.project, false, config.extLogic).reduce((accumulator, files) => ([
        ...accumulator,
        ...(typeof files === 'string' ? [files] : files),
    ]), []).reduce((accumulator, file) => (Object.assign(Object.assign({}, accumulator), (excludes.indexOf(path_1.resolve(file)) >= 0 ? {} : {
        [`${getOutputName(file, config.project)}${suffix}`]: path_1.resolve(file),
    }))), {});
};
