import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/**
 * Vitest config — kept separate from vite.config.ts (which is env-driven and
 * carries the html-head/sitemap plugin). Only the pieces tests need are set up
 * here: React JSX transform, the `@/*` alias, and the jsdom environment.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    // Components import `@/config/Api`, which throws when VITE_API_BASE_URL is
    // missing (by design). Tests don't hit the network, so provide a dummy
    // absolute URL to satisfy the guard during unit tests.
    env: {
      VITE_API_BASE_URL: 'http://localhost:4000/api',
    },
  },
});
