const { version } = require(`${__dirname}/../../../package.json`);
import * as log from 'console-emoji';

const logBuildVersion = (resolve) => {
  log(`:sparkles: Starting Biotope Build (v${version}) with :sparkling_heart:for Frontend Developers around the world :sparkles:\n`, 'green');
  resolve();
};

export default logBuildVersion;
