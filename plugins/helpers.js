
const joinPath = (left, right) => `${left}${left && left[left.length - 1] !== '/' ? '/' : ''}${right}`;

const replaceAttributes = (html, originalPath, newPath, attributes = ['href', 'src', 'content']) => attributes
  .reduce((finalHtml, attribute) => finalHtml.map((node) => node.replace(
    `${attribute}="${originalPath}`,
    `${attribute}="${joinPath(newPath, '')}`,
  )), Array.isArray(html) ? html : [html]);

const appendToHtml = (
  { outputFiles, addFile }, identifier, nodes, originalPath, destination, attributes,
) => {
  const identifierNode = `<!-- biotope-build${identifier ? ': ' : ''}${identifier} -->`;

  Object.keys(outputFiles)
    .filter((name) => name.indexOf('.html') === (name.length - '.html'.length))
    .map((name) => ({
      name,
      content: (typeof outputFiles[name].content === 'string'
        ? outputFiles[name].content
        : outputFiles[name].content.toString()),
    }))
    .forEach(({ name, content }) => {
      const newPath = joinPath(Array(name.split('/').length - 1).fill('..').join('/'), destination);
      const mappedNodes = replaceAttributes(nodes, originalPath, newPath, attributes);

      const [first, second, third] = content.split(identifierNode);
      const htmlToAppend = mappedNodes.length
        ? `\n  ${mappedNodes.join('\n  ')}\n  `
        : '';

      if ((!second && !third) || second !== htmlToAppend) {
        addFile({
          name,
          content: !second && !third
            ? content.replace('</head>', `  ${identifierNode}${htmlToAppend}${identifierNode}\n</head>`)
            : [first, htmlToAppend, third].join(identifierNode),
        }, true);
      }
    });
};

module.exports = {
  joinPath,
  replaceAttributes,
  appendToHtml,
};
