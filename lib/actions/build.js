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
const api_1 = require("../api");
const buildAction = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const exitNormally = yield api_1.build(options);
    if (!exitNormally) {
        process.exitCode = -1;
    }
});
exports.registerLint = (program) => program
    .option('-c, --config <file>', 'Specify a configuration file')
    .option('-p, --project <folder>', 'Base path for project files')
    .option('-o, --output <path>', 'Path to output files')
    .option('-y, --copy <pattern>', 'Folders to copy to output (comma separated)')
    .option('-e, --exclude <pattern>', 'Exclude these files from the build (comma separated)')
    .option('-m, --maps', 'Create map files')
    .option('-w, --watch', 'Watch the files and rebuild them when they change')
    .option('-s, --serve', 'Start a dev server')
    .option('-l, --legacy', 'Include legacy build')
    .option('-k, --chunks', 'Include chunks')
    .option('-j, --components-json [pattern]', 'Automatically create a components.json file')
    .option('--silent', 'Skip logging to the console')
    .option('--production', 'Build for production')
    .option('--ext-logic <pattern>', 'Extensions to include for logic files (comma separated)')
    .option('--ext-style <pattern>', 'Extensions to include for style files (comma separated)')
    .option('-i, --ignore-result', 'Don\'t throw on failed build (does not apply to watch)')
    .option('-d, --debug', 'Debug')
    .action(buildAction);
