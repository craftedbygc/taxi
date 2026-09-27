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
  },
});
