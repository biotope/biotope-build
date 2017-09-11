var fs = require('fs');
var gutil = require('gulp-util');
var cwd = process.cwd();

module.exports = {

    template: gutil.env.template,

	package: require(cwd + '/package.json'),

	text: function (count, max) {
		if (max !== 0 && typeof max !== 'undefined' && max > count) {
			count = Math.floor(Math.random() * max) + count;
		}
		var text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ';
		text = text + text + text;
		return text.substr(0, count);
	},

	img: function (width, height, src) {
		var splitSrc = src.split('.');
		var fileEnding = splitSrc.pop();
		return '_assets/generated/' + splitSrc.join() + '_' + width + 'x' + height + '.' + fileEnding;
	},

	link: function () {
		return 'http://www.virtual-identity.com';
	},

	renderHbs: function (template, data) {
		require(cwd + '/app/resources/js/handlebars.helper.js');
		var hbs = cwd + '/.tmp/resources/js/handlebars.templates.js';
		delete require.cache[require.resolve(hbs)];
		require(hbs);

		try {
			// is data valid JSON
			data = JSON.parse(data);
		} catch (e) {

			try {
				//is data a JSON file
				var jsonString = fs.readFileSync(data, 'utf8');
				data = JSON.parse(jsonString);
			} catch (e) {
				return '';
			}

		}

		return global.configuration.data.tpl[template](data);
	},

	delayedImage: function () {
		console.log('TODO: zetzer->delayedImage()');
	},

	inc: function(file, params) {
		return this.include(file, params);
	}
};
