import { BuildTask, BuildConfig } from '../types';
import * as consoleEmoji from 'console-emoji';

export const logVersion: BuildTask = async (config: BuildConfig, watch: boolean) => {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const { version } = require(`${__dirname}/../../package.json`);
  const loggedText = `:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart: for Frontend Developers around the world :sparkles:`;

  consoleEmoji(`${loggedText}\n`, 'green');
};