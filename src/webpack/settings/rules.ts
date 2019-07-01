import { existsSync } from 'fs';
import { resolve } from 'path';
import { Rule } from 'webpack';
import { loader as ExtractLoader } from 'mini-css-extract-plugin';

import { biotopeBuildPath } from './project-paths';
import { javascriptToSass } from './javascript-to-sass';

// eslint-disable-next-line import/no-dynamic-require
const babelOptions = require(`${biotopeBuildPath}/.babelrc.js`);

const postCssPath = `${biotopeBuildPath}/postcss.config.js`;

const getStyleNaming = (minify: boolean, globalStyles: boolean, prefix: string): string => {
  if (globalStyles) {
    return `${prefix}[name]`;
  }
  return `${prefix}${minify ? '[hash:base64:24]' : '[path][name]-[local]'}`;
};

export const getRules = (
  minify: boolean,
  global: boolean,
  extract: boolean,
  prefix: string,
  compileExclusions: string[],
  runtimeVariables: IndexObject<string>,
): Rule[] => ([
  {
    test: /\.(j|t)s$/,
    use: {
      loader: 'babel-loader',
      options: babelOptions,
    },
    ...(compileExclusions.length
      ? { exclude: new RegExp(`node_modules/(${compileExclusions.join('|')})`) }
      : {}),
  },
  {
    test: /\.s?css$/,
    use: [
      {
        loader: resolve(`${biotopeBuildPath}/lib/webpack/settings/style-loader`),
      },
      ...(extract ? [ExtractLoader] : []),
      {
        loader: 'css-loader',
        options: {
          camelCase: true,
          modules: true,
          url(url: string, resource: string): boolean {
            const resourceFolder = resource.split('/');
            resourceFolder.pop();

            return url.indexOf('http') !== 0 && url.indexOf('/') !== 0
              && (existsSync(resolve(url)) || existsSync(resolve(`${resourceFolder.join('/')}/${url}`)));
          },
          localIdentName: getStyleNaming(minify, global, prefix),
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: { path: postCssPath },
        },
      },
      {
        loader: 'sass-loader',
        options: {
          data: javascriptToSass(runtimeVariables),
        },
      },
    ],
  },
  {
    test: /\.svg$/,
    use: 'raw-loader',
  },
  {
    test: /\.(png|jpe?g|gif)$/,
    use: 'url-loader',
  },
]);
