const path = require('path');
const cwd = process.cwd();
const webpack = require('webpack');
const setupEnvVars = require('./lib/env-helper');

const generalIncludePaths = [
  path.resolve(cwd, 'src'),
  path.resolve(cwd, 'node_modules')
];

console.log('#################################################################');
console.log(`Build mode: ${process.env.NODE_ENV}`);
const environmentVariables = setupEnvVars();
console.log('#################################################################');

module.exports = {
  watch: false,

  mode: 'development',

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.scss']
  },

  output: {
    filename: '[name].js'
  },

  externals: {
    jquery: 'jQuery'
  },

  devtool: 'source-map',

  stats: {
    assets: true,
    chunks: false,
    chunkModules: false,
    colors: true,
    entrypoints: false,
    hash: false,
    timings: false,
    version: true
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ],
        include: generalIncludePaths
      },
      {
        test: /\.svg$/,
        issuer: /\.tsx?$/,
        use: [
          {
            loader: 'svg-inline-loader'
          }
        ],
        include: generalIncludePaths
      },
      {
        test: /\.svg$/,
        issuer: /\.scss$/,
        use: [
          {
            loader: 'svg-url-loader'
          }
        ],
        include: generalIncludePaths
      },
      {
        test: /\.(png|jpg|gif|mov|mp4|webm)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[folder]/[name].[ext]',
              outputPath: 'resources/components/',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: generalIncludePaths
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [['@babel/preset-env']],
              plugins: [[require('@babel/plugin-transform-classes').default, { loose: true }]]
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin(environmentVariables)
  ],

  optimization: {
    noEmitOnErrors: true,
    concatenateModules: true
  }
};

try {
  const webpackProjectConfig = require(path.join(cwd, 'webpack.config.js'));
  if (webpackProjectConfig) {
    const merge = require('lodash.merge');
    merge(module.exports, webpackProjectConfig);
  }
} catch (e) {
  console.log('No webpack.config.js in project root folder, using biotope-build default webpack.config.js: ');
}
