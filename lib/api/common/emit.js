"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const gzip_size_1 = require("gzip-size");
const run_plugins_1 = require("./run-plugins");
const checksum_1 = require("./checksum");
let lastEmittedFiles = [];
const hasChanged = (newFileName, newFileChecksum) => {
    const previousOutputFile = lastEmittedFiles.find(({ name }) => newFileName === name);
    return !previousOutputFile || previousOutputFile.checksum !== newFileChecksum;
};
exports.getAddFileFunction = (config, files) => ({ name, content, mapping }, override = false) => {
    const crc = checksum_1.checksum(content);
    const changed = hasChanged(name, crc);
    const mapFileName = `${path_1.basename(name)}.map`;
    if (!override && !changed) {
        files[name].changed = false;
        if (files[mapFileName]) {
            files[mapFileName].changed = false;
        }
        return;
    }
    let contentEnding = '';
    if (mapping && config.maps && (config.maps.environment === process.env.NODE_ENV || config.maps.environment === 'all')) {
        if (config.maps.type === 'inline' || config.maps.type === 'file') {
            contentEnding = `\n//# sourceMappingURL=${config.maps.type === 'inline' ? mapping.toUrl() : mapFileName}`;
        }
        if (config.maps.type === 'hidden' || config.maps.type === 'file') {
            const mappingContent = mapping.toString();
            files[mapFileName] = {
                name: `${name}.map`,
                content: mappingContent,
                changed,
                checksum: crc,
                size: Buffer.byteLength(mappingContent, 'utf-8'),
                gzip: gzip_size_1.sync(mappingContent),
            };
        }
    }
    files[name] = {
        name,
        content: !contentEnding || typeof content !== 'string' ? content : `${content}${contentEnding}`,
        changed,
        checksum: crc,
        size: Buffer.byteLength(content, typeof content === 'string' ? 'utf-8' : undefined),
        gzip: gzip_size_1.sync(content),
    };
};
exports.getRemoveFileFunction = (files) => ({ name, mapping }) => {
    const mapFileName = `${path_1.basename(name)}.map`;
    delete files[name];
    if (mapping) {
        delete files[mapFileName];
    }
};
exports.emit = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    yield run_plugins_1.runPlugins(options.plugins, 'before-emit', options, builds);
    builds.forEach(({ outputFiles }) => {
        Object.keys(outputFiles).forEach((filename) => {
            if (outputFiles[filename].changed) {
                const filePath = path_1.resolve(`${options.output}/${outputFiles[filename].name}`);
                fs_extra_1.createFileSync(filePath);
                fs_extra_1.writeFileSync(filePath, outputFiles[filename].content);
            }
        });
    });
    yield run_plugins_1.runPlugins(options.plugins, 'after-emit', options, builds);
    const uniqueFiles = builds.reduce((accumulator, { outputFiles }) => (Object.assign(Object.assign({}, accumulator), outputFiles)), {});
    lastEmittedFiles = Object.keys(uniqueFiles).reduce((accumulator, file) => ([
        ...accumulator,
        uniqueFiles[file],
    ]), []);
});
