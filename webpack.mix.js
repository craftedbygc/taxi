let mix = require('laravel-mix')
require('mix-tailwindcss')

mix.js('_docs/assets/js/index.js', 'assets/js')
	.setPublicPath('docs')
	.version()
	.sass('_docs/assets/sass/index.scss', 'assets/css')
	.tailwind('./_docs/tailwind.config.js')

if (!mix.inProduction()) {
	mix.browserSync({
		server: "docs",
		files: ["docs/**/*.html", "docs/assets/css/*.css", "docs/assets/js/*.js"]
	})
}
