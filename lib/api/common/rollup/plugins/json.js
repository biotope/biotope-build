"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_handlers_1 = require("../../json-handlers");
const parseContent = (file, content) => {
    try {
        let parsedContent = json_handlers_1.parseJson(content);
        if (!parsedContent || typeof parsedContent === 'number' || typeof parsedContent === 'boolean') {
            parsedContent = {};
        }
        else if (typeof parsedContent === 'string') {
            parsedContent = Array.from(parsedContent);
        }
        return parsedContent;
    }
    catch (error) {
        console.error(`File "${file}" does not contain valid JSON.`);
        throw error;
    }
};
exports.json = () => ({
    name: 'biotope-build-rollup-plugin-json',
    transform: (content, id) => {
        if (id.slice(-5) !== '.json') {
            return undefined;
        }
        const parsedContent = parseContent(id, content);
        const singleExports = Array.isArray(parsedContent) ? '' : Object.keys(parsedContent)
            .map((key) => `export const ${key} = ${JSON.stringify(parsedContent[key])};`)
            .join('\n');
        return {
            code: `${singleExports}\nexport default ${JSON.stringify(parsedContent)};\n`,
            map: { mappings: '' },
        };
    },
});
