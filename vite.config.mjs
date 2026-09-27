import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/taxi.js'),
			name: 'Taxi',
			fileName: (format) => `taxi.${format === 'es' ? 'js' : 'cjs'}`,
			// Output formats to generate
			formats: ['es', 'cjs']
		},
		rollupOptions: {
			// Externalize dependencies you don't want bundled into your library
			external: ['@unseenco/e'],
			output: {
				// Provide global variables to use in the UMD build for externalized deps
				globals: {}
			}
		},
		sourcemap: true,
		// Optional: Output directory (defaults to 'dist')
		outDir: 'dist',
		// Clear outDir before building
		emptyOutDir: true
	}
});