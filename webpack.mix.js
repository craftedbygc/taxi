let mix = require('laravel-mix')
require('mix-tailwindcss')

mix.js('docs/assets/js/index.js', 'assets/js')
	.setPublicPath('_site')
	.version()
	.sass('docs/assets/sass/index.scss', 'assets/css')
	.tailwind('./docs/tailwind.config.js')

if (!mix.inProduction()) {
	mix.browserSync({
		server: "_site",
		files: ["_site/**/*.html", "_site/assets/css/*.css", "_site/assets/js/*.js"]
	})
}
