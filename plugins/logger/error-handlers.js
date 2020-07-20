const chalk = require('chalk');

const logErrorCode = (...args) => process.stdout.write(chalk.red.bold(...args));
const logError = (...args) => process.stdout.write(chalk.red(...args));
const logWarnCode = (...args) => process.stdout.write(chalk.yellow.bold(...args));
const logWarn = (...args) => process.stdout.write(chalk.yellow(...args));

const MISSING_EXPORT = ({ error: { stack, loc: { file, line, column } } }) => {
  logErrorCode('\nMISSING_EXPORT', file.replace(process.cwd(), '.'), `(${line},${column})\n`);
  logError(stack, '\n');
};

const PARSE_ERROR = ({ error: { stack, loc: { file, line, column } } }) => {
  logErrorCode('\nPARSE_ERROR', file.replace(process.cwd(), '.'), `(${line},${column})\n`);
  logError(stack, '\n');
};

const DEFAULT = ({ error: { code, stack } }) => {
  logErrorCode(`\n${code}\n`);
  logError(stack, '\n');
};

const THIS_IS_UNDEFINED = ({
  message, url, loc: { file, line, column },
}) => {
  const localFile = file.replace(process.cwd(), '.');
  if (localFile.indexOf('./node_modules/') === 0) {
    return;
  }

  logWarnCode('\n\nTHIS_IS_UNDEFINED', localFile, `(${line},${column})\n`);
  logWarn(message, '\n');
  if (url) {
    logWarn(`More info at: ${url}\n`);
  }
  logWarn('\n');
};

const SOURCEMAP_ERROR = () => {
  // SUPPRESS ERROR (for now)

  // FIXME: fix this warning on biotope-build

  // Example:
  // SOURCEMAP_ERROR .\src\index.js (8,19)
  // Error when using sourcemap for reporting an error: Can't resolve original location of error.
};

const PLUGIN_WARNING = () => {
  // SUPPRESS ERROR (for now)

  // FIXME: fix this warning on biotope-build
};

const EMPTY_BUNDLE = () => {
  // SUPPRESS ERROR
};

const DEFAULT_WARN = ({
  code, message, url, loc, frame,
}) => {
  const localFile = (loc && loc.file) ? loc.file.replace(process.cwd(), '.') : undefined;
  if (localFile && localFile.indexOf('./node_modules/') === 0) {
    return;
  }

  logWarnCode(`\n${code}`, localFile, loc ? `(${loc.line},${loc.column})\n` : '\n');
  logWarn(message, '\n');
  if (frame) {
    logWarn(frame, '\n');
  }
  if (url) {
    logWarn(`More info at: ${url}\n`);
  }
  logWarn('\n');
};

module.exports = {
  MISSING_EXPORT,
  PARSE_ERROR,
  DEFAULT,
  THIS_IS_UNDEFINED,
  SOURCEMAP_ERROR,
  PLUGIN_WARNING,
  EMPTY_BUNDLE,
  DEFAULT_WARN,
};
