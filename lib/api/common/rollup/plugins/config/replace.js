"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = void 0;
exports.replace = (legacy) => (legacy ? ({
    'import.meta.url': '(__filename)',
    'import.meta': '({ url: __filename })',
}) : {});
