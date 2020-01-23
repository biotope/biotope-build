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
const rollup_1 = require("rollup");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const clean_folder_1 = require("./common/clean-folder");
const rollup_2 = require("./common/rollup");
const parsers_1 = require("./common/parsers");
const async_queue_1 = require("./common/async-queue");
const run_plugins_1 = require("./common/run-plugins");
const emit = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    yield run_plugins_1.runPlugins(options.plugins, 'before-emit', options, builds);
    builds.forEach(({ outputFiles }) => {
        Object.keys(outputFiles).forEach((filename) => {
            const file = path_1.resolve(`${options.output}/${filename}`);
            fs_extra_1.createFileSync(file);
            fs_extra_1.writeFileSync(file, outputFiles[filename]);
        });
    });
    yield run_plugins_1.runPlugins(options.plugins, 'after-emit', options, builds);
});
const watch = (options, builds) => {
    const { push } = async_queue_1.createAsyncQueue();
    rollup_1.watch(builds.map(({ build }) => build)).addListener('event', (event) => push(() => __awaiter(void 0, void 0, void 0, function* () {
        if (event.code === 'END') {
            yield emit(options, builds);
        }
        else {
            yield run_plugins_1.runPlugins(options.plugins, 'mid-build', options, builds, event);
        }
    })));
};
const run = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    yield run_plugins_1.runPlugins(options.plugins, 'mid-build', options, builds, { code: 'START' });
    yield Promise.all(builds.map(({ build }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield rollup_1.rollup(build);
            yield result.write(build.output);
        }
        catch (error) {
            yield run_plugins_1.runPlugins(options.plugins, 'mid-build', options, builds, { code: 'ERROR', error });
        }
    })));
    yield emit(options, builds);
});
exports.build = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedOptions = parsers_1.parseOptions(options);
    const preBuilds = rollup_2.createPreBuilds(parsedOptions);
    clean_folder_1.cleanFolder(parsedOptions.output);
    yield run_plugins_1.runPlugins(parsedOptions.plugins, 'before-build', parsedOptions, preBuilds);
    const builds = rollup_2.finalizeBuilds(preBuilds);
    yield (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
});
