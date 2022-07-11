module.exports = {
	content: ['./docs/**/*.{html,js,njk}'],
	plugins: [
		require('@tailwindcss/typography')
	],
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						"code::before": {content: ''},
						"code::after": {content: ''}
					}
				},
				"stone": {
					css: {
						"--tw-prose-pre-bg": '#263238',
					}
				}
			}
		}
	},
}