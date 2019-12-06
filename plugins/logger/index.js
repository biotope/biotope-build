const consoleEmoji = require('console-emoji');

function loggerPlugin() {
  return [
    ['before-build', (config, build) => {
      // eslint-disable-next-line import/no-dynamic-require,global-require
      const { version } = require(`${__dirname}/../../package.json`);
      const loggedText = `:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`;

      consoleEmoji(`${loggedText}\n`, 'green');

      // eslint-disable-next-line no-console
      console.log('CONFIG:', config, '\n\n');
      // eslint-disable-next-line no-console
      console.log('BUILD:', build, '\n\n');
    }],
    ['after-build', (...data) => {
      // eslint-disable-next-line no-console
      console.log('BUILD DATA:', data, '\n\n');
    }],
  ];
}

module.exports = loggerPlugin;
