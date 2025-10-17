import { test, expect } from '@playwright/test';

test.describe('Privacy', () => {
  test('should not send image/video data to external servers', async ({ page }) => {
    const externalRequests: string[] = [];

    // Intercept all network requests
    page.on('request', request => {
      const url = request.url();
      // Exclude localhost and known internal resources (e.g., Vite HMR, Playwright internal)
      if (!url.startsWith(page.baseURL!) && !url.includes('localhost') && !url.includes('playwright')) {
        externalRequests.push(url);
      }
    });

    // Navigate to the measure page (which uses camera/video)
    await page.goto('/measure', { waitUntil: 'networkidle' });

    // Wait for a short period to allow any potential background requests to be made
    // In a real scenario, you might interact with the page to trigger camera usage
    await page.waitForTimeout(5000); // Wait for 5 seconds

    // Assert that no external requests were made
    expect(externalRequests).toEqual([]);
  });
});
