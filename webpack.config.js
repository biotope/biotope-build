var excludes = ['/node_modules/', '/patterns/', '/dist/', '/test/', '/.tmp/'];

var babelOptions = {
  babelrc: false,
  presets: ['env']
};

module.exports = {
  watch: false,

  mode: 'production',

  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.scss']
  },

  output: {
    filename: '[name].js'
  },

  externals: {
    jquery: 'jQuery'
  },

  // devtool: 'source-map',

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
        ]
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: excludes
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions
          }
        ],
        exclude: excludes
      }
    ]
  },

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
    concatenateModules: true
  }
};
