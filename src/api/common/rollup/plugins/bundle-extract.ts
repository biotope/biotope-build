import {
  Plugin, OutputOptions, OutputBundle, OutputAsset, OutputChunk,
} from 'rollup';
import { addOutputFile, removeOutputFile } from '../../emit';
import { getContent } from '../../require';
import { OutputFile } from '../../types';

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

export interface BundleExtractPluginOptions {
  legacy: boolean;
  isInline: boolean;
  production: boolean;
  outputFiles: Record<string, OutputFile>;
}

export const bundleExtract = (options: BundleExtractPluginOptions): Plugin => ({
  name: 'biotope-build-rollup-plugin-extract',
  generateBundle(_: OutputOptions, bundle: OutputBundle): void {
    if (options.legacy && !options.isInline) {
      addOutputFile('require.js', getContent(options.production), options.outputFiles);
    }

    Object.keys(bundle).forEach((key) => {
      addOutputFile(key, getOutputContent(bundle[key]), options.outputFiles);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeOutputFile(key, bundle as Record<string, any>);
    });

    // TODO: add banners if "no-code-split"? or is it too late?
  },
});
