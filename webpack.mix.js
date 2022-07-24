let mix = require('laravel-mix')
require('mix-tailwindcss')

mix.js('_docs/assets/js/index.js', 'assets/js')
	.setPublicPath('documentation')
	.version()
	.sass('_docs/assets/sass/index.scss', 'assets/css')
	.tailwind('./_docs/tailwind.config.js')

if (!mix.inProduction()) {
	mix.browserSync({
		server: "documentation",
		files: ["documentation/**/*.html", "documentation/assets/css/*.css", "documentation/assets/js/*.js"]
	})
}
