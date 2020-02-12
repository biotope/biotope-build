import {
  Plugin, OutputOptions, OutputBundle, OutputAsset, OutputChunk,
} from 'rollup';
import { getContent } from '../../require';
import { LegacyOptions } from '../../types';
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
  isLegacyBuild, production, style, legacy, addFile,
}: BundleExtractPluginOptions): Plugin => ({
  name: 'biotope-build-rollup-plugin-extract',
  generateBundle(_: OutputOptions, bundle: OutputBundle): void {
    if (isLegacyBuild && (legacy as LegacyOptions).require === 'file') {
      addFile({
        name: 'require.js',
        content: getContent(production),
      });
    }

    Object.keys(bundle).forEach((name) => {
      const isCssFile = name.slice(-4) === '.css';
      const content = getOutputContent(bundle[name]);
      const mapping = (bundle[name] as OutputChunk).map;

      if (isCssFile && style.extract && (!isLegacyBuild || (legacy as LegacyOptions).only)) {
        addFile({ name: `${style.extractName}.css`, content, mapping });
      } else if (!isCssFile) {
        addFile({ name, content, mapping });
      }

      // eslint-disable-next-line no-param-reassign
      delete bundle[name];
    });
  },
});
