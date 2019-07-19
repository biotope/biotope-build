import * as log from 'console-emoji';

import { GulpTaskCallback } from '../types';

export const logVersion: GulpTaskCallback = (resolve): void => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const { version } = require(`${__dirname}/../../package.json`);

  log(`:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:\n`, 'green');
  resolve();
};
