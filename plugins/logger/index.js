const chalk = require('chalk');
const {
  version, log, logTitle, logStrong, logTable, createTicker,
} = require('./helpers');
const errorHandlers = require('./error-handlers');

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

const midBuild = ({ start, stop }, { debug }, builds, event, isFirstTime) => {
  if (debug) {
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

  if (event.code === 'ERROR') {
    stop();
    try {
      (errorHandlers[event.error.code] || errorHandlers.DEFAULT)(event);
    } catch (_) {
      // eslint-disable-next-line no-console
      console.error(event);
    }
  }
};

const beforeEmit = ({ stop }, { debug }, [{ warnings }]) => {
  if (debug) {
    return;
  }
  stop();

  Object.keys(warnings)
    .reduce((accumulator, key) => ([...accumulator, ...warnings[key]]), [])
    .forEach((warning) => {
      try {
        (errorHandlers[warning.code] || errorHandlers.DEFAULT_WARN)(warning);
      } catch (_) {
        // eslint-disable-next-line no-console
        console.warn(warning);
      }
    });
};

const afterEmitBuild = (_, { debug, output }, builds) => {
  if (debug) {
    logStrong(chalk.yellow('\n\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }

  log('\n\n');
  logTable(output, builds);

  logStrong('\nBuild complete\n\n');
};

const afterEmitWatch = (_, { debug, output }, builds) => {
  if (debug) {
    logStrong(chalk.yellow('\nBUILD DATA:\n'));
    // eslint-disable-next-line no-console
    console.log(builds);
    return;
  }

  const currentTime = (new Date(Date.now())).toTimeString().split(' ')[0];

  log('\n\n');
  logTable(output, builds);

  logStrong(`\nFinished build at ${chalk.underline(currentTime)}\n`);
  log('Press [Enter] to manually trigger a rebuild…\n\n');
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
      hook: 'before-emit',
      priority: -10,
      runner(projectConfig, builds, event) {
        beforeEmit(ticker, projectConfig, builds, event, isFirstTime);
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
