import { test, expect } from '@playwright/test';

test.describe('Permissions', () => {
  test('should only request camera permission', async ({ page }) => {
    let getUserMediaConstraints: MediaStreamConstraints | undefined;

    // Mock navigator.mediaDevices.getUserMedia to capture constraints
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: async (constraints: MediaStreamConstraints) => {
            (window as any).getUserMediaConstraints = constraints;
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

    // Navigate to the measure page to trigger camera access
    await page.goto('/measure', { waitUntil: 'networkidle' });

    // Retrieve the captured constraints from the page context
    getUserMediaConstraints = await page.evaluate(() => (window as any).getUserMediaConstraints);

    // Assert that getUserMedia was called with only video constraints
    expect(getUserMediaConstraints).toBeDefined();
    expect(getUserMediaConstraints?.video).toBeTruthy();
    expect(getUserMediaConstraints?.audio).toBeFalsy();
  });
});
