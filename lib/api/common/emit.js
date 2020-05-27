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
exports.emit = exports.getRemoveFileFunction = exports.getAddFileFunction = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const gzip_size_1 = require("gzip-size");
const run_plugins_1 = require("./run-plugins");
const checksum_1 = require("./checksum");
const generateRandomId = (length = 32) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    return [...Array(length)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};
const isCorrectEnvironment = ({ maps, production }) => maps.environment === 'all'
    || (production && maps.environment === 'production')
    || (!production && maps.environment === 'development');
let buildId = generateRandomId();
const setOutputFile = (files, name, values) => {
    if (!files[name]) {
        files[name] = { name };
    }
    Object.keys(values).forEach((key) => {
        files[name][key] = values[key];
    });
};
exports.getAddFileFunction = (config, files) => ({ name, content, mapping }) => {
    const mapName = `${name}.map`;
    const isUpdate = (files[name] || {}).buildId === buildId;
    const crc = checksum_1.checksum(content);
    const previousCrc = (files[name] || {})[!isUpdate ? 'checksum' : 'previousChecksum'];
    const changed = crc !== previousCrc;
    let contentEnding = '';
    if (mapping && config.maps && isCorrectEnvironment(config)) {
        if (config.maps.type === 'inline' || config.maps.type === 'file') {
            contentEnding = `\n//# sourceMappingURL=${config.maps.type === 'inline' ? mapping.toUrl() : path_1.basename(mapName)}`;
        }
        if (config.maps.type === 'hidden' || config.maps.type === 'file') {
            const mappingContent = mapping.toString();
            setOutputFile(files, mapName, {
                content: mappingContent,
                checksum: crc,
                changed,
                size: Buffer.byteLength(mappingContent, 'utf-8'),
                gzip: gzip_size_1.sync(mappingContent),
                buildId,
                previousChecksum: previousCrc,
            });
        }
    }
    const finalContent = !contentEnding || typeof content !== 'string' ? content : `${content}${contentEnding}`;
    setOutputFile(files, name, {
        content: finalContent,
        checksum: crc,
        changed,
        size: Buffer.byteLength(finalContent, typeof finalContent === 'string' ? 'utf-8' : undefined),
        gzip: gzip_size_1.sync(finalContent.toString()),
        buildId,
        previousChecksum: previousCrc,
    });
};
const removeFromObject = (key, object) => {
    delete object[key];
    return object;
};
exports.getRemoveFileFunction = (files) => (file) => {
    const name = typeof file === 'string' ? file : file.name;
    const mapName = `${name}.map`;
    if (files[mapName]) {
        removeFromObject(mapName, files);
    }
    removeFromObject(name, files);
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
    Object.keys(builds[0].warnings).forEach((key) => {
        delete builds[0].warnings[key];
    });
    buildId = generateRandomId();
});
