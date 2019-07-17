const localPackage = require('../../package.json');
import * as log from 'console-emoji';

const logBuildVersion = (cb) => {
  log(`:sparkles: Starting Biotope Build (v${localPackage.version}) with :sparkling_heart:for Frontend Developers around the world :sparkles:\n`, 'green');
  cb();
};

export default logBuildVersion;
