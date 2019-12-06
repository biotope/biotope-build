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
const watch = (options, builds) => {
    const plugins = parsers_1.getPlugins(options.plugins, 'after-build');
    const eventEmitter = rollup_1.watch(builds);
    eventEmitter.addListener('event', (...data) => plugins.forEach(([, plugin]) => plugin(...data)));
};
const run = (options, builds) => __awaiter(void 0, void 0, void 0, function* () {
    const plugins = parsers_1.getPlugins(options.plugins, 'after-build');
    const outputBuilds = yield Promise.all(builds.map((build) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield rollup_1.rollup(build);
        return result.write(build.output);
    })));
    plugins.forEach(([, plugin]) => plugin(outputBuilds));
});
exports.build = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedOptions = parsers_1.parseOptions(options);
    clean_folder_1.cleanFolder(parsedOptions.output);
    const builds = rollup_2.createAllBuilds(parsedOptions);
    parsers_1.getPlugins(parsedOptions.plugins, 'before-build').forEach(([, plugin]) => plugin(parsedOptions, builds));
    (!parsedOptions.watch ? run : watch)(parsedOptions, builds);
});
