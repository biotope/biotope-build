const chalk = require('chalk');
const {
  version, log, logTitle, logStrong, createTicker, logTable,
} = require('./helpers');

const beforeBuild = (_, projectConfig) => {
  logTitle(`:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`);

  if (projectConfig.debug) {
    logStrong(chalk.yellow('CONFIG:\n'));
    // eslint-disable-next-line no-console
    console.log(projectConfig);
    return;
  }

  logStrong('\nEnvironment: ');
  log(`${projectConfig.production ? 'production' : 'development'}\n`);
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
    logStrong(isFirstTime ? '\nDiscovering and building files' : '\nRebuilding files');
    start();
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
  logStrong('\n\n');

  logTable(projectConfig.output, builds);

  logStrong('\nBuild complete\n\n');
};

const afterEmitWatch = ({ stop }, projectConfig, builds /* , isFirstTime */) => {
  if (projectConfig.debug) {
    logStrong(chalk.yellow('\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }
  stop();
  logStrong('\n\n');

  const currentTime = (new Date(Date.now())).toTimeString().split(' ')[0];

  logTable(projectConfig.output, builds);

  logStrong(`\nFinished build at ${chalk.underline(currentTime)}\n`);
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
