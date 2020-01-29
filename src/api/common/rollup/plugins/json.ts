import { Plugin, TransformResult } from 'rollup';
import { parseJson } from '../../json-handlers';

const parseContent = (file: string, content: string): Record<string, object> | object[] => {
  try {
    let parsedContent: Record<string, object> | object[] = parseJson(content);

    if (!parsedContent || typeof parsedContent === 'number' || typeof parsedContent === 'boolean') {
      parsedContent = {};
    } else if (typeof parsedContent === 'string') {
      parsedContent = Array.from(parsedContent);
    }

    return parsedContent;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`File "${file}" does not contain valid JSON.`);
    throw error;
  }
};

export const json = (): Plugin => ({
  name: 'biotope-build-rollup-plugin-json',
  transform: (content, id): TransformResult => {
    if (id.slice(-5) !== '.json') {
      return undefined;
    }

    const parsedContent = parseContent(id, content);
    const singleExports = Array.isArray(parsedContent) ? '' : Object.keys(parsedContent)
      .map((key) => `export const ${key} = ${JSON.stringify((parsedContent as Record<string, object>)[key])};`)
      .join('\n');

    return {
      code: `${singleExports}\nexport default ${JSON.stringify(parsedContent)};\n`,
      map: { mappings: '' },
    };
  },
});
