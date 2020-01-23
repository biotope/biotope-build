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
const emitFile = (folder, { name, content }) => {
    const filePath = path_1.resolve(`${folder}/${name}`);
    fs_extra_1.createFileSync(filePath);
    fs_extra_1.writeFileSync(filePath, content);
};
exports.addOutputFile = (name, content, files) => {
    const crc = checksum_1.checksum(content);
    files[name] = {
        name,
        content,
        changed: hasChanged(name, crc),
        checksum: crc,
        size: Buffer.byteLength(content, typeof content === 'string' ? 'utf-8' : undefined),
        gzip: gzip_size_1.sync(content),
    };
};
exports.removeOutputFile = (file, files) => {
    delete files[file];
};
exports.emit = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    yield run_plugins_1.runPlugins(options.plugins, 'before-emit', options, builds);
    builds.forEach(({ outputFiles }) => {
        Object.keys(outputFiles).forEach((filename) => {
            if (hasChanged(outputFiles[filename].name, outputFiles[filename].checksum)) {
                emitFile(options.output, outputFiles[filename]);
            }
        });
    });
    yield run_plugins_1.runPlugins(options.plugins, 'after-emit', options, builds);
    lastEmittedFiles = builds.reduce((accumulator, { outputFiles }) => ([
        ...accumulator,
        ...Object.values(outputFiles),
    ]), []);
});
