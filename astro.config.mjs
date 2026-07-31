// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import yaml from '@rollup/plugin-yaml';

// https://astro.build/config
export default defineConfig({
  // Absolute URL of the deployed site. Required so the sitemap, RSS feed,
  // and canonical links are generated with the right domain.
  site: 'https://seprab.com',
  integrations: [sitemap()],
  vite: {
    // Lets any file do `import data from '../data/foo.yaml'`.
    plugins: [yaml()],
  },
});
