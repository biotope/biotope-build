const path = require('path');
const fs = require('fs');
const config = require('../config');

const parseEnvFile = (filename) => {
  const filePath = path.resolve(config.global.cwd, filename);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = fs.readFileSync(filePath);
  const lines = data.toString().split('\n');
  const obj = {};
  for (const line of lines) {
    if (line.indexOf('=') !== -1 && line.indexOf('#') === -1) {
      const arr = line.split('=');
      obj[arr[0]] = JSON.stringify(arr[1].replace(/\n|\r/g, ''));
    }
  }
  return obj;
};


module.exports = function () {
  const nodeEnv = process.env.NODE_ENV;
  let environmentVariables = {
    ENV: JSON.stringify(nodeEnv)
  };

  if (nodeEnv === 'production') {
    environmentVariables = Object.assign({}, environmentVariables, parseEnvFile(config.env.files.production));
  } else if (nodeEnv === 'staging') {
    environmentVariables = Object.assign({}, environmentVariables, parseEnvFile(config.env.files.staging));
  } else {
    environmentVariables = Object.assign({}, environmentVariables, parseEnvFile(config.env.files.development));
  }
  return environmentVariables;
};
