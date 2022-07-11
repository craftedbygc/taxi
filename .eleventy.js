const htmlmin = require("html-minifier");
const date = Date.now()

function getFromManifest(name) {
	try {
		const assets = require("./_site/mix-manifest.json")

		if (name[0] !== '/') {
			name = '/' + name
		}

		return assets[name] || name + '?id=' + date
	} catch (error) {
		return name + '?id=' + date
	}
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({ "docs/_public": '/' })

	/**
	 * Add the asset shortcode to fetch an asset name from mix-manifest.json
	 *
	 * @example {% asset 'css/style.css' %}
	 */
	eleventyConfig.addShortcode("asset", function (name) {
		return getFromManifest(name)
	});

	eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
		if( outputPath && outputPath.endsWith(".html") ) {
			return htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				minifyJS: true,
				collapseWhitespace: true
			});
		}

		return content;
	});

	return {
		dir: { input: 'docs', data: '_data' },
		passthroughFileCopy: true,
		templateFormats: ['njk', 'md', 'html'],
		htmlTemplateEngine: 'njk'
	}
};