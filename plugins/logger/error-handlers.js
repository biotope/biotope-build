const chalk = require('chalk');

const logErrorCode = (...args) => process.stdout.write(chalk.red.bold(...args));
const logError = (...args) => process.stdout.write(chalk.red(...args));
const logWarnCode = (...args) => process.stdout.write(chalk.yellow.bold(...args));
const logWarn = (...args) => process.stdout.write(chalk.yellow(...args));

const MISSING_EXPORT = ({ error: { stack, loc: { file, line, column } } }) => {
  logErrorCode('\n\nMISSING_EXPORT', file.replace(process.cwd(), '.'), `(${line},${column})`);
  logError(stack, '\n');
};

const PARSE_ERROR = ({ error: { stack, loc: { file, line, column } } }) => {
  logErrorCode('\n\nPARSE_ERROR', file.replace(process.cwd(), '.'), `(${line},${column})`);
  logError(stack, '\n');
};

const DEFAULT = ({ error: { code, stack } }) => {
  logErrorCode(`\n\n${code}`);
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

const DEFAULT_WARN = ({
  code, message, url, loc: { file, line, column }, frame,
}) => {
  const localFile = file.replace(process.cwd(), '.');
  if (localFile.indexOf('./node_modules/') === 0) {
    return;
  }

  logWarnCode(`\n\n${code}`, localFile, `(${line},${column})\n`);
  logWarn(message, '\n');
  logWarn(frame, '\n');
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
  DEFAULT_WARN,
};
