
export const defaultOptions = {
  compilation: {
    extensions: ['.js', '.ts', '.scss', '.css'],
    externalFiles: [{
      from: './src/resources',
      to: 'resources',
      ignore: ['*.md'],
    }],
    chunks: [{
      test: /node_modules/,
      name: 'core',
      enforce: true,
      priority: 100,
      chunks: 'all' as 'all' | 'initial' | 'async',
      minChunks: 1,
    }],
  },
};
