import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load the app within 5 seconds under simulated 3G conditions', async ({ page, browserName }) => {
    // Emulate network conditions only for Chromium-based browsers
    if (browserName === 'chromium') {
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 400,
        downloadThroughput: 750 * 1024 / 8, // Playwright expects bytes/second, not bits/second
        uploadThroughput: 250 * 1024 / 8,
      });
    } else {
      // For other browsers, we cannot emulate network conditions directly.
      // We can either skip the test or run it without network emulation.
      // For now, we'll skip it for non-chromium browsers.
      test.skip();
    }

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 }); // Increased timeout for slow network
    const endTime = Date.now();

    const loadTime = endTime - startTime;
    console.log(`App loaded in ${loadTime} ms under simulated 3G conditions.`);

    // Assert that the load time is less than 5 seconds (5000 ms)
    expect(loadTime).toBeLessThan(5000);
  });
});