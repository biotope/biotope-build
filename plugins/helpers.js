
function onEvent(event, callback, eventCode) {
  return [event, async (...args) => {
    if (!eventCode || !args[0].code) {
      return callback(...args);
    }
    if (args[0].code === eventCode) {
      return callback(...args);
    }
    return undefined;
  }];
}

function beforeBuildStart(callback) {
  return onEvent('before-build', callback);
}

function onBuildStart(callback) {
  return onEvent('after-build', callback, 'START');
}

function onBundleStart(callback) {
  return onEvent('after-build', callback, 'BUNDLE_START');
}

function onBundleEnd(callback) {
  return onEvent('after-build', callback, 'BUNDLE_END');
}

function onBuildEnd(callback) {
  return onEvent('after-build', callback, 'END');
}

function saveConfig(parentConfig) {
  return beforeBuildStart((config) => {
    Object.keys(config).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      parentConfig[key] = config[key];
    });
  });
}

module.exports = {
  onEvent,
  saveConfig,
  beforeBuildStart,
  onBuildStart,
  onBundleStart,
  onBundleEnd,
  onBuildEnd,
};
