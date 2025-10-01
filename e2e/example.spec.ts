import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5174', {
    waitUntil: 'networkidle',
    timeout: 90000,
  }); // Assuming Vite dev server runs on 5174
  await expect(page).toHaveTitle(/はかったけ/);
});
