const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

const parseEnvFile = (filename) => {
  const filePath = path.resolve(cwd, filename);
  if (!fs.existsSync(filePath)) {
    console.warn('No env file found!');
    return {};
  }
  const data = fs.readFileSync(filePath);
  const lines = data.toString().split('\n');
  const obj = {};
  for (const line of lines) {
    if (line.indexOf('=') !== -1 && line.indexOf('#') === -1) {
      const arr = line.split('=');
      obj[arr[0]] = JSON.stringify(arr[1]);
    }
  }
  return obj;
};


module.exports = function () {
  let environmentVariables = {
    ENV: JSON.stringify(process.env.NODE_ENV)
  };
  if (process.env.NODE_ENV === 'production') {
    environmentVariables = Object.assign({}, environmentVariables, parseEnvFile('prodvars.env'));

  } else {
    environmentVariables = Object.assign({}, environmentVariables, parseEnvFile('devvars.env'));
  }
  return environmentVariables;
};
