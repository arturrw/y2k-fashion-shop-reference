// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // start loading a page as soon as a link is hovered
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },

  // Vercel sets VERCEL=1 during its builds; everywhere else (Docker, local) we ship a Node server
  adapter: process.env.VERCEL ? vercel() : node({ mode: 'standalone' }),
});