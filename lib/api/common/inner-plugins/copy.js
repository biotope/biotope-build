"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCopyConfig = (config, requirePath) => ([
    [
        ...config.copy.map((folder) => ({
            files: `${config.project}/${folder}/**/*`,
            dest: `${config.output}/${folder}`,
        })),
        ...(requirePath && !config.legacy.inline
            ? [{ files: requirePath, dest: config.output }]
            : []),
    ],
    { watch: config.watch },
]);
