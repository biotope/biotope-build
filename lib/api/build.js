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
let isQueueRunning = false;
const eventQueue = [];
const runEventQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!eventQueue.length || isQueueRunning) {
        isQueueRunning = false;
        return;
    }
    isQueueRunning = true;
    yield eventQueue.pop()();
    setTimeout(runEventQueue, 0);
});
const eventListener = (plugins) => (event) => {
    eventQueue.unshift(() => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all(plugins.map(([, plugin]) => parsers_1.toThenable(plugin(event))));
    }));
    runEventQueue();
};
const watch = (options, builds) => {
    const plugins = parsers_1.getPlugins(options.plugins, 'after-build');
    rollup_1.watch(builds).addListener('event', eventListener(plugins));
};
const run = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    const plugins = parsers_1.getPlugins(options.plugins, 'after-build');
    const outputBuilds = yield Promise.all(builds.map((build) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield rollup_1.rollup(build);
        return result.write(build.output);
    })));
    yield Promise.all(plugins.map(([, plugin]) => parsers_1.toThenable(plugin(outputBuilds))));
});
exports.build = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedOptions = parsers_1.parseOptions(options);
    const builds = rollup_2.createAllBuilds(parsedOptions);
    clean_folder_1.cleanFolder(parsedOptions.output);
    yield Promise.all(parsers_1.getPlugins(parsedOptions.plugins, 'before-build')
        .map(([, plugin]) => parsers_1.toThenable(plugin(parsedOptions, builds))));
    yield (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
});
