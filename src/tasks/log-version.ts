import * as consoleEmoji from 'console-emoji';

import { GulpTaskCallback } from '../types';

export const logVersion: GulpTaskCallback = (resolve): void => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const { version } = require(`${__dirname}/../../package.json`);
  const loggedText = `:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`;

  consoleEmoji(`${loggedText}\n`, 'green');
  resolve();
};
