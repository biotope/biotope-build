const chalk = require('chalk');
const consoleEmoji = require('console-emoji');

// eslint-disable-next-line import/no-dynamic-require
const { version } = require(`${__dirname}/../../package.json`);

const toKb = (size) => `${Math.round(size * 100) / 100} KB`;

const logTitle = (...args) => consoleEmoji(chalk.green.bold(...args));
const logStrong = (...args) => process.stdout.write(chalk.bold(...args));
const log = (...args) => process.stdout.write(chalk(...args));

const cleanChalk = (str) => str.replace(/[^ -~]+/g, '').replace(/\[[0-9][0-9]m/g, '');

const checkLimit = (size, total, t) => {
  const transform = t || ((s) => s);
  let warning = false;
  if (size > total && size > 1) {
    warning = true;
  }
  if (size < 10 && !warning) {
    return chalk.white(transform(size));
  }
  if (size < 20) {
    return chalk.yellow(transform(size));
  }
  return size < 50 ? chalk.red(transform(size)) : chalk.bgRed(transform(size));
};

const sortPaths = (files) => files.sort(({ name: leftName }, { name: rightName }) => {
  const leftSplit = leftName.split('/');
  const rightSplit = rightName.split('/');
  return leftSplit.reduce((result, slug, index) => {
    if (typeof result === 'number' || rightSplit[index] === slug) {
      return result;
    }

    const leftIsDir = index !== leftSplit.length - 1;
    const rightIsDir = index !== rightSplit.length - 1;
    if (leftIsDir === rightIsDir) {
      if (slug > rightSplit[index]) {
        return 1;
      }
      if (slug < rightSplit[index]) {
        return -1;
      }
      return 0;
    }
    if (leftIsDir) {
      return -1;
    }
    if (rightIsDir) {
      return 1;
    }
    return 0;
  }, null);
});

const isInfinity = (percent) => Number.isNaN(percent) || percent === Infinity || percent > 500;

const createTableLayout = (folder, builds) => {
  const filteredFiles = [...builds].reverse().reduce((accumulator, { outputFiles }) => ([
    ...accumulator,
    ...Object.values(outputFiles)
      .filter((file) => file.changed && !accumulator.find(({ name }) => file.name === name))
      .map((file) => ({
        ...file,
        size: file.size / 1024,
        gzip: file.gzip / 1024,
        percent: Math.round((file.gzip / file.size) * 100),
      })),
  ]), []);

  return sortPaths(filteredFiles, (file) => file.name, '/').reduce((accumulator, {
    name, size, gzip, percent,
  }) => ([...accumulator, [
    `${chalk.grey(`${folder}/`)}${name}`,
    toKb(size),
    checkLimit(gzip, size, () => `${toKb(gzip)} ${percent <= 100 ? ' ' : ''}(${isInfinity(percent) ? '---' : percent}%)`),
  ]]), [['Assets', 'Size', 'Gzipped']]);
};

const logTable = (folder, builds) => {
  const table = createTableLayout(folder, builds);

  if (table.length === 1) {
    log('No file changes detected…\n');
    return;
  }

  const columnSizes = table.reduce((accumulator, row) => row.reduce((acc, column, index) => ({
    ...acc,
    [index]: Math.max(accumulator[index] || 0, cleanChalk(column).length),
  }), {}), {});

  const alignRight = (str, length) => (cleanChalk(str).length >= length ? str : alignRight(` ${str}`, length));
  const alignLeft = (str, length) => (cleanChalk(str).length >= length ? str : alignLeft(`${str} `, length));

  table
    .map((row) => row.reduce((rowText, column, index) => `${rowText}${(index === 0 ? alignLeft : alignRight)(column, columnSizes[index])}  `, ''))
    .forEach((row, index) => (index ? log : logStrong)(`${row}\n`));
};

const createTicker = (ticker = { isRunning: undefined }) => ({
  start: () => {
    // eslint-disable-next-line no-param-reassign
    ticker.isRunning = setInterval(() => process.stdout.write('.'), 150);
  },
  stop: () => clearInterval(ticker.isRunning),
});

module.exports = {
  version,
  toKb,
  logTitle,
  logStrong,
  log,
  cleanChalk,
  logTable,
  checkLimit,
  createTicker,
};
