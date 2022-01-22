let mix = require('laravel-mix');

if (!mix.inProduction()) {
	mix.browserSync({
		server: "tests"
	})
		.js('tests/app.js', 'tests/app.dist.js')
		.setPublicPath('tests');
} else {
	mix.js('src/index.js', 'dist')
		.setPublicPath('dist')
}

