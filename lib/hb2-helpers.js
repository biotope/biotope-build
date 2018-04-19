module.exports = function(handlebars) {
	/**
	 * defines a default let iable value, that gets overwritten by context data
	 * @param {Any} a 
	 * @param {Any} b
	 * @return {String} return a if exist b if not
	 */
	handlebars.registerHelper('bioDef', (a, b) => a || b);

	/**
	 * Creates image src for generated assets
	 * @param {Number} width - image width
	 * @param {Number} heigth - image heigth
	 * @param {Number} src - image source
	 * @return {String} source generated based on input parameters
	 */
	handlebars.registerHelper('bioImg', (width, height, src) => {
		let splitSrc = src.split('.');
		let fileEnding = splitSrc.pop();

		return `_assets/generated/${splitSrc.join()}_${width}x${height}.${fileEnding}`;
	});

	/**
	 * Creates fill text with a max of characters
	 * @param {Number} count - image width
	 * @param {Number} max - image heigth
	 * @return {String} description
	 */
	handlebars.registerHelper('bioText', (count, max) => {
		if (max !== 0 && typeof max !== 'undefined' && max > count) {
			count = Math.floor(Math.random() * max) + count;
		}
		
		const text = 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now. When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream; and, as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath of that universal love which bears and sustains us, as it floats around us in an eternity of bliss; and then, my friend, when darkness overspreads my eyes, and heaven and earth seem to dwell in my soul and absorb its power, like the form of a beloved mistress, then I often think with longing, Oh, would I could describe these conceptions, could impress upon paper all that is living so full and warm within me, that it might be the mirror of my soul, as my soul is the mirror of the infinite God! O my friend -- but it is too much for my strength -- I sink under the weight of the splendour of these visions! ';
		const bioText = `${text}${text}${text}`;

		return bioText.substr(0, count);
	});

	/**
	 * Defines a code block to allow curly brackets for other frameworks
	 * use with {{{{code}}}} {{{{/code}}}} (4 curly brackets for literal string contents)
	 * @param {Object} content - image width
	 * @return {Function} function to be executed 
	 */
	handlebars.registerHelper('bioCode', content => content.fn());

	/**
	 * Stringify an json/js object for debugging
	 * @param {Object} obj - an object
	 * @return {Function} object stringified 
	 */
	handlebars.registerHelper('bioStringify', obj => JSON.stringify(obj));

	/**
	 * Executes an option function with the parsed data
	 * @param {Object} data - a data object
	 * @param {Object} options - options object
	 * @return {Function}
	 */
	handlebars.registerHelper('bioParseJSON', (data, options) => 
		options.fn(JSON.parse(data))
	);

	/**
	 * Includes a partial
	 * @param {Object} partialName
	 * @param {Object} context
	 * @return {Function}
	 */
	handlebars.registerHelper('bioInclude', (partialName, context) => {
		if (typeof partialName !== 'string') {
			return '';
		}

		let partials = handlebars.partials;
		let partial = partials[partialName];

		if (typeof partial !== 'function') {
			partial = handlebars.compile(partial);
		}

		// if partial doesn't exist use block failover
		if (!partial) {
			console.log('partial ' + partialName + ' not found: block helper fallback will be used');
			return context.fn(this);
		}

		let objectData = {};

		if (context.hash.hasOwnProperty('object')) {
			if (typeof context.hash.object === 'string') {
				objectData = JSON.parse(context.hash.object);
			}
			if (typeof context.hash.object === 'object') {
				objectData = context.hash.object;
			}
		}

		let partialData = deepMergeObjectsIntoNew(this, objectData, context.hash);

		return new handlebars.SafeString(partial(partialData));
	});

	/**
	 * {{#bioCompare}}...{{/bioCompare}}
	 *
	 * @credit: OOCSS
	 * @param left value
	 * @param operator The operator, must be between quotes ">", "==", "<=", etc...
	 * @param right value
	 * @param options option object sent by handlebars
	 * @return {String} formatted html
	 *
	 * @example:
	 * {{#bioCompare unicorns "<" ponies}}
	 * I knew it, unicorns are just low-quality ponies!
	 * {{/bioCompare}}
	 *
	 * {{#bioCompare value ">=" 10}}
	 * The value is greater or equal than 10
	 * {{else}}
	 * The value is lower than 10
	 * {{/bioCompare}}
	 */
	handlebars.registerHelper('bioCompare', (left, operator, right, options) => {
		/*jshint eqeqeq: false*/
		if (arguments.length < 3) {
			throw new Error('Handlebars Helper "bioCompare" needs 2 parameters');
		}

		// Probably is better to use some decomposing here
		if (options === undefined) {
			options = right;
			right = operator;
			operator = '===';
		}

		let operators = {
			'==': (l, r) => l == r,
			'===': (l, r) => l === r,
			'!=': (l, r) => l != r,
			'!==': (l, r) => l !== r,
			'<': (l, r) => l < r,
			'>': (l, r) => l > r,
			'<=': (l, r) => l <= r,
			'>=': (l, r) => l >= r,
			'typeof': (l, r) => typeof l == r
		};

		if (!operators[operator]) {
			throw new Error('Handlebars Helper "bioCompare" doesn\'t know the operator ' + operator);
		}

		let result = operators[operator](left, right);
		
		if (result) {
			return options.fn(this);
		}

		return options.inverse(this);
		
	});

	/**
	 * Allows math operations between two values
	 * {{math 10 '+' 15}} return 25
	 * {{math 15 '-' 10}} return 5
	 * {{math 10 '/' 2}} return 5
	 * {{math 5 '*' 10}} return 50
	 * {{math 10 '%' 3}} return 1
	 * @param {Number} - lvalue
	 * @param {string} - operator
	 * @param {Number} - rvalue
	 * @return {Number} - result of a given operation
	 */
	handlebars.registerHelper("bioMath", (lvalue, operator, rvalue) => {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);

		return {
			"+": lvalue + rvalue,
			"-": lvalue - rvalue,
			"*": lvalue * rvalue,
			"/": lvalue / rvalue,
			"%": lvalue % rvalue
		}[operator];
	});

};

let deepMergeObjectsIntoNew = () => {
	let newObject = {};

	let merge = obj => {
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					newObject[prop] = deepMergeObjectsIntoNew(true, newObject[prop], obj[prop]);
				} else {
					newObject[prop] = obj[prop];
				}
			}
		}
	};

	for (let i = 0; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return newObject;
};
