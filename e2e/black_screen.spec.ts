import { test, expect } from '@playwright/test';

test.describe('Black Screen Issue Investigation', () => {
  test.beforeEach(async ({ page }) => {
    // Do NOT mock navigator.xr here to simulate a non-AR capable device
    // or a device where AR initialization fails.
    // We will mock getUserMedia to ensure camera access is granted for fallback.
    await page.addInitScript(() => {
      window.isPlaywrightTest = true;
      // Mock getUserMedia to simulate successful camera access for fallback
      Object.defineProperty(navigator, 'mediaDevices', {
        writable: true,
        value: {
          getUserMedia: (constraints: MediaStreamConstraints) => {
            console.log('Mocking getUserMedia with constraints:', constraints);
            // Simulate a video stream
            const mockStream = {
              getVideoTracks: () => [{ stop: () => {} }],
              getAudioTracks: () => [],
              stop: () => {},
            };
            return Promise.resolve(mockStream as MediaStream);
          },
        },
      });
    });
    await page.goto('/measure', { waitUntil: 'networkidle' });
  });

  test('should display fallback camera view (video element) when AR is not available', async ({ page }) => {
    // Expect a video element to be visible, indicating the fallback camera is active.
    const videoElement = page.locator('video');
    await expect(videoElement).toBeVisible({ timeout: 10000 });

    // Further check: ensure the video is actually playing and not just a black box.
    // This is harder to do in Playwright without pixel analysis or mocking the video stream content.
    // For now, visibility is a good first step for a failing test.
    // If the screen is black, the video element might not be visible or might not have a srcObject.
  });
});
