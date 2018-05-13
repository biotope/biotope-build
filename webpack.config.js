const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const path = require('path');
const cwd = process.cwd();

const generalIncludePaths = [
  path.resolve(cwd, 'src')
];

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
    version: true,
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
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
              presets: ['env']
            }
          }
        ],
        include: generalIncludePaths
      }
    ]
  },

  plugins: [
    new HardSourceWebpackPlugin()
  ],

  optimization: {
    noEmitOnErrors: true,
    concatenateModules: true
  }
};
