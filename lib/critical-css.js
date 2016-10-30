var critical = require('critical');

var width = 1170;
var height = 1000;

exports.generate = function(dest, html, args) {
	var wIndex = args.indexOf('-w');
	var hIndex = args.indexOf('-h');
	var options = {
		html: html,
		minify: true,
		inline: true,
		dest: dest
	};

	if (wIndex !== -1) {
		width = args[wIndex + 1];

		if (!isNaN(width)) {
			options.width = parseInt(width);
		} else {
			console.log('Provided width is not valid');
		}
	}

	if (hIndex !== -1) {
		height = args[hIndex + 1];

		if (!isNaN(height)) {
			options.height = parseInt(height);
		} else {
			console.log('Provided height is not valid');
		}
	}

	critical.generate(options).then(function() {
		console.log('Page successfully generated!');
	}).error(function(error) {
		console.log(error);
	});
};
