#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var processLinks = require('../lib/process-links');
var mkdirp = require('mkdirp');
var cheerio = require('cheerio');
var minify = require('html-minifier').minify;
var md5File = require('md5-file');
var UglifyJS = require("uglify-js");
var args = process.argv.slice(2);
var packageConfig = require('../package.json');
var assets = 'moff-assets';
var links = {
	normalized: [],
	origin: []
};
var sources = {
	normalized: [],
	origin: []
};
var $, source, output, jsDest, cssDest, html;

process.title = 'moff';

if (!args[0]) {
	console.log('Command is not provided.\nExample:\n$ moff source.html output.html');
	return;
}

if (args[0] === '-v') {
	console.log('v' + packageConfig.version);
	return;
}

source = args[0];
output = args[1];

if (!args[1]) {
	var sourcePath = path.parse(source);

	sourcePath.base = 'moff-' + sourcePath.base;
	output = path.format(sourcePath);
}

jsDest = path.join(process.cwd(), assets, path.basename(output) + '.js');
cssDest = path.join(process.cwd(),  assets, path.basename(output) + '.css');
$ = cheerio.load(fs.readFileSync(source));

try {
	fs.statSync(assets);
} catch(e) {
	fs.mkdirSync(assets);
}

$('script').each(function() {
	var script = $(this);
	var src = script.attr('src');

	if (!src || script.attr('async')) {
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

if (sources.normalized.length) {
	fs.writeFileSync(jsDest, UglifyJS.minify(sources.normalized).code, {mode: 0777});
	md5File(jsDest, function(error, hash) {
		var newPath = '/' + assets + '/' + hash + '.js';

		$('script[src="' + sources.origin[0] + '"]').before('<script src="' + newPath + '">');

		for (var i = 0, length = sources.origin.length; i < length; i++) {
			$('script[src="' + sources.origin[i] + '"]').remove();
		}

		fs.rename(jsDest, path.join(process.cwd(), newPath), function() {
			processLinks(links, $, cssDest, output, args);
		});
	});
}

if (!sources.normalized.length && links.normalized.length) {
	processLinks(links, $, cssDest, output, args);
}

if (!sources.normalized.length && !links.normalized.length) {
	html = minify($.html(), {
		collapseWhitespace: true,
		maxLineLength: 200,
		minifyCSS: true,
		minifyJS: true
	});

	fs.writeFileSync(output, html, {mode: 0777});
	console.log('Page successfully generated!');
}
