
export const defaultOptions = {
  compilation: {
    extensions: ['.js', '.ts', '.scss', '.css'],
    externalFiles: [{
      from: './src/resources',
      to: 'resources',
      ignore: ['*.md'],
    }],
  },
};
