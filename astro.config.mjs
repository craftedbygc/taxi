import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Directs Astro to look in ./docs instead of the default ./src directory
  srcDir: './docs',
  // publicDir isn't relative to srcDir, so it must be set explicitly
  publicDir: './docs/public',

  outDir: '_site',

  // Pages build to <page>/index.html, so a link without the trailing slash
  // triggers a server redirect (which the host issues over http, causing
  // mixed-content errors). Enforcing it makes the dev server 404 on those links.
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },
});
