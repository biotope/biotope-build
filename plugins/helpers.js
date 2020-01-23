
const isLegacyBuild = (legacyOption, build) => {
  if (!legacyOption) {
    return false;
  }
  const legacyRegex = new RegExp(`${legacyOption.suffix}$`);
  return !!Object.keys(build.input || {}).find((file) => legacyRegex.test(file));
};

module.exports = {
  isLegacyBuild,
};
