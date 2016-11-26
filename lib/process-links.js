var path = require('path');
var fs = require('fs');
var concat = require('concatenate-files');
var md5File = require('md5-file');
var criticalCss = require('../lib/critical-css');
var CleanCSS = require('clean-css');
var minify = require('html-minifier').minify;
var assets = 'moff-assets';
var html;

module.exports = function(links, $, cssDest, output, args) {
	concat(links.normalized, cssDest, function(error, result) {
		if (error) {
			console.log(error);
		}

		var minified = new CleanCSS().minify(result.outputData).styles;
		var newPath;

		fs.writeFileSync(cssDest, minified, {mode: 0777});
		md5File(cssDest, function(error, hash) {
			newPath = '/' + assets + '/' + hash + '.css';

			$('link[href="' + links.origin[0] + '"]').before('<link rel="stylesheet" href="' + newPath + '">');

			for (var i = 0, length = links.origin.length; i < length; i++) {
				$('link[href="' + links.origin[i] + '"]').remove();
			}

			fs.renameSync(cssDest, path.join(process.cwd(), newPath));
			html = $.html();

			if (args.indexOf('--minify-html') !== -1) {
				html = minify(html, {
					collapseWhitespace: true,
					maxLineLength: 200,
					minifyCSS: true,
					minifyJS: true
				});
			}

			criticalCss.generate(output, html, args);
		});
	});
};
