import { test, expect } from '@playwright/test';

test.describe('No Tracking', () => {
  test('should not include analytics, advertising, or tracking SDKs', async ({ page }) => {
    const trackingDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'mixpanel.com',
      'segment.io',
      'analytics.google.com',
      'doubleclick.net',
      'adservice.google.com',
      'facebook.com/tr',
      'app-measurement.com',
      'amplitude.com',
      'hotjar.com',
      'fullstory.com',
      'sentry.io',
      'logrocket.com',
      // Add more known tracking domains as needed
    ];

    const trackingRequests: string[] = [];

    // Mock navigator.mediaDevices to prevent camera access issues in test environment
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: async (constraints: MediaStreamConstraints) => {
            console.log('Mocked getUserMedia called with constraints:', constraints);
            // Return a fake MediaStream
            return { 
              getTracks: () => [{ stop: () => {} }],
              getVideoTracks: () => [{ stop: () => {} }],
              getAudioTracks: () => [],
              id: 'mock-stream-id',
              active: true,
            } as MediaStream;
          },
        },
        configurable: true,
      });
    });

    page.on('request', request => {
      const url = request.url();
      // Exclude localhost and known internal resources (e.g., Vite HMR, Playwright internal)
      if (!url.startsWith(page.baseURL!) && !url.includes('localhost') && !url.includes('playwright')) {
        if (trackingDomains.some(domain => url.includes(domain))) {
          trackingRequests.push(url);
        }
      }
    });

    // Navigate to the home page and interact briefly to trigger any potential tracking
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.click('text=計測モード'); // Navigate to another page to trigger more potential requests
    await page.waitForLoadState('networkidle');

    // Assert that no tracking requests were made
    expect(trackingRequests).toEqual([]);
  });
});