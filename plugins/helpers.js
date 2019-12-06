
function saveConfigPlugin(parentConfig) {
  return ['before-build', (config) => {
    Object.keys(config).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      parentConfig[key] = config[key];
    });
  }];
}

const runOnceAfterBuildPlugin = (state, callback, conditionCallback) => {
  let isFirstRun = true;
  return ['after-build', async ({ code }) => {
    if (isFirstRun && code === state && (!conditionCallback || conditionCallback())) {
      isFirstRun = false;
      return callback();
    }
    return undefined;
  }];
};

function runOnceAfterBuildStartPlugin(...args) {
  return runOnceAfterBuildPlugin('START', ...args);
}
function runOnceAfterBuildEndPlugin(...args) {
  return runOnceAfterBuildPlugin('END', ...args);
}

module.exports = {
  saveConfigPlugin,
  runOnceAfterBuildPlugin,
  runOnceAfterBuildStartPlugin,
  runOnceAfterBuildEndPlugin,
};
