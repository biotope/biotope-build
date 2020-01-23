const consoleEmoji = require('console-emoji');
const chalk = require('chalk');
const { sync: gzipSize } = require('gzip-size');

// eslint-disable-next-line import/no-dynamic-require
const { version } = require(`${__dirname}/../../package.json`);

const toKb = (size) => `${Math.round(size * 100) / 100} KB`;

const logTitle = (...args) => consoleEmoji(chalk.green.bold(...args));
const logSection = (...args) => process.stdout.write(chalk.bold.underline(...args));
const logStrong = (...args) => process.stdout.write(chalk.bold(...args));
const log = (...args) => process.stdout.write(chalk(...args));

const cleanChalk = (str) => str.replace(/[^ -~]+/g, '').replace(/\[[0-9][0-9]m/g, '');

const logTable = (table) => {
  const columnSizes = table.reduce((accumulator, row) => row.reduce((acc, column, index) => ({
    ...acc,
    [index]: Math.max(accumulator[index] || 0, cleanChalk(column).length),
  }), {}), {});

  const alignRight = (str, length) => (cleanChalk(str).length >= length ? str : alignRight(` ${str}`, length));

  table
    .map((row) => row.reduce((rowText, column, index) => `${rowText}${alignRight(column, columnSizes[index])} `, ''))
    .forEach((row, index) => (index ? log : logStrong)(`${row}\n`));
};

const checkLimit = (size, total, t) => {
  let warning = false;
  if (size > total) {
    warning = true;
  }
  if (size < 10 && !warning) {
    return chalk.white(t(size));
  }
  if (size < 20) {
    return chalk.yellow(t(size));
  }
  return size < 50 ? chalk.red(t(size)) : chalk.bgRed(t(size));
};

const createTicker = (ticker = { isRunning: undefined }) => ({
  start: () => {
    // eslint-disable-next-line no-param-reassign
    ticker.isRunning = setInterval(() => process.stdout.write('.'), 50);
  },
  stop: () => clearInterval(ticker.isRunning),
});

module.exports = {
  version,
  toKb,
  logTitle,
  logSection,
  logStrong,
  log,
  cleanChalk,
  logTable,
  checkLimit,
  gzipSize,
  createTicker,
};
