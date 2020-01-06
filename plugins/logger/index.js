const { statSync, readFileSync } = require('fs-extra');
const { resolve } = require('path');
const consoleEmoji = require('console-emoji');
const chalk = require('chalk');
const { sync: gzipSize } = require('gzip-size');
const { beforeBuildStart, onBuildEvent, saveConfig } = require('../helpers');

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

let IS_RUNNING;
const startTicking = () => {
  IS_RUNNING = setInterval(() => process.stdout.write('.'), 50);
};
const stopTicking = () => clearInterval(IS_RUNNING);

const onStart = (projectConfig, builds) => {
  logTitle(`:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`);

  if (projectConfig.debug) {
    logStrong(chalk.yellow('CONFIG:\n'));
    // eslint-disable-next-line no-console
    console.log(projectConfig);
    logStrong(chalk.yellow('BUILD:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }

  logSection('\nDiscovering and building files');
  if (!projectConfig.watch) {
    startTicking();
  } else {
    logSection('…\n');
  }
};

const onBuild = (projectConfig, outputs) => {
  if (projectConfig.debug) {
    logStrong(chalk.yellow('\n\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(outputs);
    return;
  }

  stopTicking();
  logSection('\n\nOutput:\n');

  const table = outputs
    .reduce((accumulator, { output }) => ([
      ...accumulator,
      ...(output.map((file) => file.fileName)),
    ]), [])
    .sort()
    .map((file) => ({
      asset: `./${projectConfig.output}/${file}`,
      size: statSync(resolve(`${projectConfig.output}/${file}`)).size / 1024,
      gzip: gzipSize(readFileSync(resolve(`${projectConfig.output}/${file}`)).toString()) / 1024,
    }))
    .reduce((accumulator, file) => [
      ...accumulator,
      ...(!accumulator.find((item) => item.asset === file.asset) ? [file] : []),
    ], [])
    .reduce((accumulator, { asset, size, gzip }) => ([
      ...accumulator,
      [
        asset,
        toKb(size),
        checkLimit(gzip, size, (s) => `${toKb(s)} (${Math.round((s * 100) / size)}%)`),
      ],
    ]), [['Assets', 'Size', 'Gzipped']]);

  logTable(table);
};

const onWatch = (projectConfig, output, isFirstTime) => {
  if (projectConfig.debug) {
    logStrong(chalk.yellow('\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(output);
    return;
  }

  if (!isFirstTime && output.code === 'START') {
    logSection('\nRebuilding files…\n');
  }

  // if (output.code === 'BUNDLE_END') {
  //   // TODO: output compiled files…
  // }

  if (output.code === 'END') {
    const currentTime = (new Date(Date.now())).toTimeString().split(' ')[0];
    logStrong(`\nFinished building at ${chalk.underline(currentTime)}\n`);
  }

  if (output.code === 'ERROR') {
    // eslint-disable-next-line no-console
    console.error('Error:', output.error.code);
    // eslint-disable-next-line no-console
    console.log(output.error);

    try {
      const { file, line, column } = output.error.loc;
      // eslint-disable-next-line no-console
      console.error('Origin:', file.replace(process.cwd(), '.'), `(${line},${column})`);
      // eslint-disable-next-line no-empty
    } catch (_) {}

    // eslint-disable-next-line no-console
    console.error('\n', output.error.stack);
  }
};

function loggerPlugin() {
  const projectConfig = {};
  let isFirstTime = true;
  return [
    saveConfig(projectConfig),
    beforeBuildStart((_, builds) => {
      onStart(projectConfig, builds);
    }),
    onBuildEvent('after-build', (data) => {
      (!projectConfig.watch ? onBuild : onWatch)(projectConfig, data, isFirstTime);
      isFirstTime = false;
    }),
  ];
}

module.exports = loggerPlugin;
