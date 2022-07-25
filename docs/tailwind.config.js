module.exports = {
	content: ['./docs/**/*.{html,js,njk,md}'],
	darkMode: 'class',
	plugins: [
		require('@tailwindcss/typography')
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif"],
				neue: ["Neue Montreal", "sans-serif"],
			},
			colors: {
				taxi: '#F4BA00',
				code: '#263238'
			},
			typography: {
				DEFAULT: {
					css: {
						"code::before": {content: ''},
						"code::after": {content: ''},
						"--tw-prose-pre-bg": '#263238',
						"--tw-prose-invert-pre-bg": '#263238',
					}
				}
			}
		}
	},
}