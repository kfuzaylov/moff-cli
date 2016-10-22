#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var criticalCss = require('../lib/critical-css');
var colors = require('colors');
var PrettyError = require('pretty-error');
var mkdirp = require('mkdirp');
var concat = require('concatenate-files');
var CleanCSS = require('clean-css');
var cheerio = require('cheerio');
var md5File = require('md5-file');
var minify = require('html-minifier').minify;
var UglifyJS = require("uglify-js2");
var assets = 'moff-assets';
var args = process.argv.slice(2);
var pe = new PrettyError();
var links = {
	normalized: [],
	origin: []
};
var sources = {
	normalized: [],
	origin: []
};
var $, source, output, jsDest, cssDest;

process.title = 'moff';

if (!args[0]) {
	console.log('Source file is not provides.\nExample:\n$ moff source.html output.html'.red);
	return;
}

source = args[0];
output = args[1];

if (!args[1]) {
	var sourcePath = path.parse(source);

	sourcePath.base = 'moff-' + sourcePath.base;
	output = path.format(sourcePath);
}

jsDest = assets + '/' + path.basename(output) + '.js';
cssDest = assets + '/' + path.basename(output) + '.css';
$ = cheerio.load(fs.readFileSync(source));

try {
	fs.statSync(assets);
} catch(e) {
	fs.mkdirSync(assets);
}

$('script').each(function() {
	var src = $(this).attr('src');

	if (!src) {
		return;
	}

	if (!/^http/.test(src) && !/^\/\//.test(src)) {
		sources.origin.push(src);

		if (/^\//.test(src)) {
			sources.normalized.push(path.join(process.cwd(), src));
		} else {
			sources.normalized.push(path.join(process.cwd(), path.dirname(source), src));
		}
	}
});

fs.writeFile(jsDest, UglifyJS.minify(sources.normalized).code, {mode: 0777}, function() {
	md5File(jsDest, function(error, hash) {
		var newPath = '/' + assets + '/' + hash + '.js';

		$('script[src="' + sources.origin[0] + '"]').before('<script src="' + newPath + '">');

		for (var i = 0, length = sources.origin.length; i < length; i++) {
			$('script[src="' + sources.origin[i] + '"]').remove();
		}

		fs.rename(jsDest, newPath, function() {});
	});
});

$('link[rel="stylesheet"]').each(function() {
	var href = $(this).attr('href');

	if (!/^http/.test(href) && !/^\/\//.test(href)) {
		links.origin.push(href);

		if (/^\//.test(href)) {
			links.normalized.push(path.join(process.cwd(), href));
		} else {
			links.normalized.push(path.join(process.cwd(), path.dirname(source), href));
		}
	}
});

concat(links.normalized, cssDest, function(error, result) {
	if (error) {
		console.log(pe.render(error));
	}

	var minified = new CleanCSS().minify(result.outputData).styles;
	var newPath;

	fs.writeFile(cssDest, minified, {mode: 0777}, function() {
		md5File(cssDest, function(error, hash) {
			newPath = '/' + assets + '/' + hash + '.css';

			$('link[href="' + links.origin[0] + '"]').before('<link rel="stylesheet" href="' + newPath + '">');

			for (var i = 0, length = links.origin.length; i < length; i++) {
				$('link[href="' + links.origin[i] + '"]').remove();
			}

			fs.rename(cssDest, newPath, function() {
				criticalCss.generate(output, minify($.html(), {
					collapseWhitespace: true,
					maxLineLength: 200,
					minifyJS: true
				}), args);
			});
		});
	});
});