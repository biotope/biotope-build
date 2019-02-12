import { VariantName, Variants } from 'favicons-webpack-plugin';

import { Options, Settings, FaviconsSettings } from './types';

const allVariants: VariantName[] = [
  'android',
  'appleIcon',
  'appleStartup',
  'coast',
  'firefox',
  'opengraph',
  'twitter',
  'yandex',
  'windows',
];

const listToVariants = (variants: VariantName[], defaultValue: boolean): Variants => variants
  .reduce((collection, variant) => ({
    ...collection,
    [variant]: defaultValue,
  }), {}) as Variants;

export const getFavicons = (webpack: Options['webpack'], paths: Settings['paths'], minify: boolean): FaviconsSettings => ({
  additionalVariants: ((webpack || {}).favicons || {}).additionalVariants || [],
  cache: ((webpack || {}).favicons || {}).cache || false,
  file: `${paths.assetsAbsolute}/favicon.png`,
  icons: {
    favicons: true,
    ...listToVariants(allVariants, false),
    ...listToVariants([
      ...(((webpack || {}).favicons || {}).additionalVariants || []),
      ...(minify ? allVariants : []),
    ], true),
  },
  output: ((webpack || {}).favicons || {}).output || 'favicon',
});
