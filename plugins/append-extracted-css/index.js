const { appendToHtml } = require('../helpers');

const appendExtractedCssPlugin = () => ({
  name: 'biotope-build-plugin-append-extracted-css',
  hook: 'before-emit',
  priority: -5,
  runner({ style }, [{ outputFiles, addFile }]) {
    const cssFileName = `${style.extractName}.css`;
    if (style.extract && outputFiles[cssFileName]) {
      if (style.extract === 'inject') {
        appendToHtml(outputFiles, addFile, 'config-style-extract', [`<link rel="stylesheet" href="/${cssFileName}">`]);
      }
      if (style.extract === 'inline') {
        appendToHtml(outputFiles, addFile, 'config-style-extract', [`<style>${outputFiles[cssFileName].content}</style>`]);
      }
    }
  },
});

module.exports = appendExtractedCssPlugin;
