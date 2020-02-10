import {
  Plugin, OutputOptions, OutputBundle, OutputAsset, OutputChunk,
} from 'rollup';
import { getContent } from '../../require';
import { BundleExtractPluginOptions } from './types';

const getOutputContent = (output: OutputAsset | OutputChunk): string | Buffer => {
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output.type === 'asset' || (output as any).isAsset)
    && (typeof (output as OutputAsset).source === 'string' || (output as OutputAsset).source !== undefined)
  ) {
    return (output as OutputAsset).source;
  }

  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output.type === 'chunk' || (output as any).isAsset === undefined)
    && (typeof (output as OutputChunk).code === 'string' || (output as OutputChunk).code !== undefined)
  ) {
    return (output as OutputChunk).code;
  }

  return '';
};

export const bundleExtract = ({
  legacy, isInline, production, styleExtracted, suffix, addFile,
}: BundleExtractPluginOptions): Plugin => ({
  name: 'biotope-build-rollup-plugin-extract',
  generateBundle(_: OutputOptions, bundle: OutputBundle): void {
    if (legacy && !isInline) {
      addFile({
        name: 'require.js',
        content: getContent(production),
      });
    }

    Object.keys(bundle).forEach((key) => {
      let filename = key;
      if (styleExtracted && key.slice(-4) === '.css') {
        filename = `index${suffix}.css`;
      }

      addFile({
        name: filename,
        content: getOutputContent(bundle[key]),
        mapping: (bundle[key] as OutputChunk).map,
      });
      // eslint-disable-next-line no-param-reassign
      delete bundle[key];
    });
  },
});
