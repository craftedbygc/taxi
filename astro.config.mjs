import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Directs Astro to look in ./docs instead of the default ./src directory
  srcDir: './docs',
  // publicDir isn't relative to srcDir, so it must be set explicitly
  publicDir: './docs/public',

  outDir: '_site',

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        // view-transitions-demo.js is referenced directly (unhashed) by the
        // static, non-templated demo pages in docs/public/view-transitions-demo,
        // so it needs its own entry point with a stable output filename.
        input: {
          'view-transitions-demo': './docs/js/view-transitions-demo.js',
        },
        output: {
          entryFileNames: (chunk) => chunk.name === 'view-transitions-demo'
            ? 'assets/js/view-transitions-demo.js'
            : 'assets/[name]-[hash].js',
        },
      },
    },
  },
});