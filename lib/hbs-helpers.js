const config = require('./../config');
const gutil = require('gulp-util');

module.exports.register = function (handlebars) {
	/**
	 * defines a default variable value, that gets overwritten by context data
	 */
	handlebars.registerHelper('def', function (a, b) {
		return a ? a : b;
	});

	/**
	 * creates fill text
	 */
	handlebars.registerHelper('text', function (count, max) {
		if (max !== 0 && typeof max !== 'undefined' && max > count) {
			count = Math.floor(Math.random() * max) + count;
		}
		let text = 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love which bears and sustains us, as it floats around us in an eternity of bliss; and then, my friend, when darkness overspreads my eyes, and heaven and earth seem to dwell in my soul and absorb its power, like the form of a beloved mistress, then I often think with longing, Oh, would I could describe these conceptions, could impress upon paper all that is living so full and warm within me, that it might be the mirror of my soul, as my soul is the mirror of the infinite God! O my friend -- but it is too much for my strength -- I sink under the weight of the splendour of these visions! ';
		text = text + text + text;
		return text.substr(0, count);
	});

	/**
	 * defines a code block to allow curly brackts for other frameworks
	 * use with {{{{code}}}} {{{{/code}}}} (4 curly brackets for literal string contents)
	 */
	handlebars.registerHelper('code', function(content) {
		return content.fn();
	});

	/**
	 * stringify an json/js object for debugging
	 */
	handlebars.registerHelper('stringify', function(object) {
		return JSON.stringify(object);
	});

	/**
	 * stringify an json/js object for debugging
	 */
	handlebars.registerHelper('parseJSON', function(data, options) {

		return options.fn(JSON.parse(data));
	});

	/**
	 * include a partial
	 */
	handlebars.registerHelper('include', function(partialName, context) {
		if (typeof partialName !== 'string') {
			return '';
		}

		const partials = handlebars.partials;
		const partial = partials[partialName];

		// if partial doesn't exist use block failover
		if (!partial) {
			gutil.log(gutil.colors.red('partial not found: block helper fallback will be used'));
			return context.fn(this);
		}

		let objectData = {};
		let jsonData = {};
		let contextData = {};

		if (config.global.debug) {gutil.log(gutil.colors.blue('--- include helper: debug ---'));}
		if (config.global.debug) {gutil.log(gutil.colors.green('partialName: ' + partialName));}
		if (config.global.debug) {gutil.log(gutil.colors.green('context.hash: ' + context.hash));}

		if(context.hash.hasOwnProperty('json')) {
			jsonData = context.hash.json.split('.').reduce((o,i)=>o[i], this);

			if (config.global.debug) {gutil.log(gutil.colors.green('jsonData: ' + jsonData));}
		}

		if(context.hash.hasOwnProperty('object')) {
			objectData = JSON.parse(context.hash.object);

			if (config.global.debug) {gutil.log(gutil.colors.green('objectData: ' + objectData));}
		}

		if(context.hash.hasOwnProperty('context')) {
			contextData = context.hash.context;

			if (config.global.debug) {gutil.log(gutil.colors.green('contextData: ' + contextData));}
		}

		// TODO Think about order of overwriting sequence!!!
		const partialData = Object.assign({}, objectData, jsonData, contextData, context.hash);

		if (config.global.debug) {gutil.log(gutil.colors.green('MERGED = OBJECT + JSON + CONTEXT + HASH: ' + partialData));}
		if (config.global.debug) {gutil.log(gutil.colors.blue('--- include helper: debug end ---'));}

		return new handlebars.SafeString(partial(partialData));
	});
};
