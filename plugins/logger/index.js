const { statSync, readFileSync } = require('fs-extra');
const { resolve } = require('path');
// const consoleEmoji = require('console-emoji');
const chalk = require('chalk');
const {
  version, logTitle, logStrong, logSection, createTicker, gzipSize, toKb, checkLimit, logTable,
} = require('./helpers');

const beforeBuild = (_, projectConfig) => {
  logTitle(`:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`);

  if (projectConfig.debug) {
    logStrong(chalk.yellow('CONFIG:\n'));
    // eslint-disable-next-line no-console
    console.log(projectConfig);
  }
};

const midBuild = ({ start }, projectConfig, builds, event, isFirstTime) => {
  if (projectConfig.debug) {
    logStrong(chalk.yellow('EVENT:\n'));
    // eslint-disable-next-line no-console
    console.log(event);
    logStrong(chalk.yellow('BUILD:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }

  if (event.code === 'START') {
    logSection(isFirstTime ? '\nDiscovering and building files' : '\nRebuilding files');
    if (!projectConfig.watch) {
      start();
    } else {
      logSection('…\n');
    }
  }

  // TODO - implement better error logging
  if (event.code === 'ERROR') {
    // eslint-disable-next-line no-console
    console.error('Error:', event.error.code);
    // eslint-disable-next-line no-console
    console.log(event.error);

    try {
      const { file, line, column } = event.error.loc;
      // eslint-disable-next-line no-console
      console.error('Origin:', file.replace(process.cwd(), '.'), `(${line},${column})`);
      // eslint-disable-next-line no-empty
    } catch (__) {}

    // eslint-disable-next-line no-console
    console.error('\n', event.error.stack);
  }
};

const afterEmitBuild = ({ stop }, projectConfig, builds) => {
  if (projectConfig.debug) {
    logStrong(chalk.yellow('\n\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }
  stop();
  logSection('\n\nOutput:\n');

  // TODO: separate compiled from assets
  const table = builds
    .reduce((accumulator, { outputFiles }) => ([
      ...accumulator,
      ...Object.keys(outputFiles),
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

const afterEmitWatch = (_, projectConfig, builds /* , isFirstTime */) => {
  if (projectConfig.debug) {
    logStrong(chalk.yellow('\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }
  const currentTime = (new Date(Date.now())).toTimeString().split(' ')[0];

  logStrong(`\nFinished building at ${chalk.underline(currentTime)}\n`);
};

const loggerPlugin = () => {
  const ticker = createTicker();
  let isFirstTime = true;
  return [
    {
      name: 'biotope-build-plugin-logger',
      hook: 'before-build',
      priority: 10,
      runner(projectConfig, builds) {
        beforeBuild(ticker, projectConfig, builds);
      },
    },
    {
      name: 'biotope-build-plugin-logger',
      hook: 'mid-build',
      priority: 10,
      runner(projectConfig, builds, event) {
        midBuild(ticker, projectConfig, builds, event, isFirstTime);
      },
    },
    {
      name: 'biotope-build-plugin-logger',
      hook: 'after-emit',
      priority: -10,
      runner(projectConfig, builds) {
        const fn = !projectConfig.watch ? afterEmitBuild : afterEmitWatch;
        fn(ticker, projectConfig, builds, isFirstTime);
        isFirstTime = false;
      },
    },
  ];
};

module.exports = loggerPlugin;
