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
const clean_folder_1 = require("./common/clean-folder");
const rollup_2 = require("./common/rollup");
const parsers_1 = require("./common/parsers");
const async_queue_1 = require("./common/async-queue");
const run_plugins_1 = require("./common/run-plugins");
const emit_1 = require("./common/emit");
var WatchState;
(function (WatchState) {
    WatchState[WatchState["STOPPED"] = 0] = "STOPPED";
    WatchState[WatchState["BUILDING"] = 1] = "BUILDING";
    WatchState[WatchState["WAITING"] = 2] = "WAITING";
})(WatchState || (WatchState = {}));
let buildHasErrors = false;
let watchState = WatchState.STOPPED;
let fullRebuild = false;
const handleKeypress = (data) => {
    if (watchState === WatchState.WAITING && data.indexOf('\n') >= 0) {
        fullRebuild = true;
    }
};
const watch = (options, builds) => {
    watchState = WatchState.BUILDING;
    const { push } = async_queue_1.createAsyncQueue();
    const runner = rollup_1.watch(builds.map(({ build }) => build));
    runner.addListener('event', (event) => push(() => __awaiter(void 0, void 0, void 0, function* () {
        if (event.code === 'END') {
            yield emit_1.emit(options, builds);
            fullRebuild = false;
            watchState = WatchState.WAITING;
        }
        else {
            yield run_plugins_1.runPlugins(options.plugins, 'mid-build', options, builds, event);
        }
    })));
    return new Promise((_, reject) => {
        const check = () => {
            if (watchState === WatchState.WAITING && fullRebuild) {
                runner.close();
                setTimeout(() => reject(), 0);
            }
            else {
                setTimeout(check, 100);
            }
        };
        check();
    });
};
const run = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    yield run_plugins_1.runPlugins(options.plugins, 'mid-build', options, builds, { code: 'START' });
    yield Promise.all(builds.map(({ build }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield rollup_1.rollup(build);
            yield result.write(build.output);
        }
        catch (error) {
            buildHasErrors = true;
            yield run_plugins_1.runPlugins(options.plugins, 'mid-build', options, builds, { code: 'ERROR', error });
        }
    })));
    yield emit_1.emit(options, builds);
});
const start = (parsedOptions, preBuilds) => __awaiter(void 0, void 0, void 0, function* () {
    const builds = rollup_2.finalizeBuilds(preBuilds);
    yield (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
    return !buildHasErrors || parsedOptions.ignoreResult;
});
exports.build = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const originalEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = options.production ? 'production' : 'development';
    let processShouldEnd = false;
    let result = false;
    if (options.watch) {
        process.stdin.on('data', handleKeypress);
    }
    const parsedOptions = parsers_1.parseOptions(options);
    const preBuilds = rollup_2.createPreBuilds(parsedOptions);
    clean_folder_1.cleanFolder(parsedOptions.output);
    yield run_plugins_1.runPlugins(parsedOptions.plugins, 'before-build', parsedOptions, preBuilds);
    while (!processShouldEnd) {
        try {
            result = yield start(parsedOptions, preBuilds);
            processShouldEnd = true;
        }
        catch (_) {
            if (!options.watch) {
                processShouldEnd = true;
            }
            fullRebuild = false;
            watchState = WatchState.STOPPED;
        }
    }
    process.env.NODE_ENV = originalEnvironment;
    if (options.watch) {
        process.stdin.off('data', handleKeypress);
    }
    return result;
});
