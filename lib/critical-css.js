var critical = require('critical');
var colors = require('colors');
var PrettyError = require('pretty-error');
var pe = new PrettyError();

exports.generate = function(dest, html, args) {
	var wIndex = args.indexOf('-w');
	var hIndex = args.indexOf('-h');
	var width = args[wIndex + 1];
	var height = args[hIndex + 1];
	var options = {
		html: html,
		minify: true,
		inline: true,
		dest: dest
	};

	if (!isNaN(width)) {
		options.width = parseInt(width);
	} else if (wIndex !== -1) {
		console.log('Provided width is not valid'.yellow);
	}

	if (!isNaN(height)) {
		options.height = parseInt(height);
	} else if (hIndex !== -1) {
		console.log('Provided height is not valid'.yellow);
	}


	critical.generate(options).then(function() {
		console.log('Page successfully generated!'.green);
	}).error(function(error) {
		console.log(pe.render(error));
	});
};
