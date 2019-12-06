"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
const buildAction = (options) => api_1.build(options);
exports.registerLint = (program) => program
    .option('-c, --config <file>', 'Specify a configuration file')
    .option('-p, --project <folder>', 'Base path for project files')
    .option('-o, --output <path>', 'Path to output files')
    .option('-y, --copy <pattern>', 'Folders to copy to output (comma separated)')
    .option('-e, --exclude <pattern>', 'Exclude these files from the build (comma separated)')
    .option('-w, --watch', 'Watch the files and rebuild them when they change')
    .option('-s, --serve', 'Start a dev server')
    .option('-l, --legacy', 'Include legacy build')
    .option('-k, --chunks', 'Include chunks')
    .option('--production', 'Build for production')
    .option('--ext-logic <pattern>', 'Extensions to include for logic files (comma separated)')
    .option('--ext-style <pattern>', 'Extensions to include for style files (comma separated)')
    .action(buildAction);
