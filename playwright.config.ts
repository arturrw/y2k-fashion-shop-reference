import { defineConfig, devices } from '@playwright/test';

// Runs against a dev server on :4322 (needs Postgres with seeded data),
// or set BASE_URL to an already running instance (e.g. http://localhost for docker).
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4322';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce', // keeps interactions deterministic; motion.spec.ts opts back in
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx astro dev --ignore-lock --port 4322 --host 127.0.0.1',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
