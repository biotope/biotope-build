const config = require('../config');

const createComponentPathFrom = (basePath) => basePath + config.global.components;

module.exports = createComponentPathFrom;
