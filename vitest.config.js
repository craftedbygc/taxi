import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.js'],
		environmentOptions: {
			jsdom: {
				url: 'http://localhost/',
			},
		},
		coverage: {
			provider: 'v8',
			include: ['src/**/*.js'],
			exclude: ['src/taxi.js'],
		},
	},
})
