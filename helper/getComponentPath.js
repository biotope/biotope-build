const config = require('../config');
const createComponentPathFrom = require('./createComponentPathFrom');

module.exports = {
	getComponentPathSrc: () => createComponentPathFrom(config.global.src),
	getComponentPathDev: () => createComponentPathFrom(config.global.dev),
	getComponentPathDist: () => createComponentPathFrom(config.global.dist),
};
