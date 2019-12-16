
function onBuildEvent(event, callback, eventCode) {
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
  return onBuildEvent('before-build', callback);
}

function onBuildStart(callback) {
  return onBuildEvent('after-build', callback, 'START');
}

function onBundleStart(callback) {
  return onBuildEvent('after-build', callback, 'BUNDLE_START');
}

function onBundleEnd(callback) {
  return onBuildEvent('after-build', callback, 'BUNDLE_END');
}

function onBuildEnd(callback) {
  return onBuildEvent('after-build', callback, 'END');
}

function saveConfig(parentConfig) {
  return beforeBuildStart((config) => {
    Object.keys(config).forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      parentConfig[key] = config[key];
    });
  });
}

const isLegacyBuild = (legacyOption, build) => {
  if (!legacyOption) {
    return false;
  }
  const legacyRegex = new RegExp(`${legacyOption.suffix}$`);
  return !!Object.keys(build.input || {}).find((file) => legacyRegex.test(file));
};

module.exports = {
  isLegacyBuild,
  onBuildEvent,
  saveConfig,
  beforeBuildStart,
  onBuildStart,
  onBundleStart,
  onBundleEnd,
  onBuildEnd,
};
