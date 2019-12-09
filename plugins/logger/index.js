const consoleEmoji = require('console-emoji');
const { beforeBuildStart, onEvent } = require('../helpers');

function loggerPlugin() {
  return [
    beforeBuildStart((projectConfig, build) => {
      // eslint-disable-next-line import/no-dynamic-require,global-require
      const { version } = require(`${__dirname}/../../package.json`);
      const loggedText = `:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`;

      consoleEmoji(`${loggedText}\n`, 'green');

      // eslint-disable-next-line no-console
      console.log('CONFIG:', projectConfig);
      // eslint-disable-next-line no-console
      console.log('BUILD:', build);
    }),
    onEvent('after-build', (...data) => {
      // eslint-disable-next-line no-console
      console.log('BUILD DATA:', data);
    }),
  ];
}

module.exports = loggerPlugin;
