import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    mockWebXr: {
      startSession: () => void;
      setPlaneDetected: (detected: boolean) => void;
      addHitTestPoint: (point: [number, number, number]) => void;
    };
  }
}

test.describe('AR Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.isPlaywrightTest = true;
      let hitTestResultsIndex = 0;
      // @ts-expect-error - Mock for testing
      window.mockHitTestPositions = [
        { x: 1, y: 1, z: 1 },
        { x: 2, y: 2, z: 2 },
      ];

      // Mock XRFrame
      const mockXRFrame = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        getViewerPose: (referenceSpace: any) => ({
          transform: {
            matrix: new Float32Array(16).fill(1),
            position: { x: 0, y: 0, z: 0 },
            orientation: { x: 0, y: 0, z: 0, w: 1 },
          },
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        getHitTestResults: (hitTestSource: any) => {
          // @ts-expect-error - Mock for testing
          const position = window.mockHitTestPositions[hitTestResultsIndex];
          hitTestResultsIndex =
            // @ts-expect-error - Mock for testing
            (hitTestResultsIndex + 1) % window.mockHitTestPositions.length; // Cycle through positions

          return [
            {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
              getPose: (referenceSpace: any) => ({
                transform: {
                  matrix: new Float32Array(16).fill(1),
                  position,
                  orientation: { x: 0, y: 0, z: 0, w: 1 },
                },
              }),
            },
          ];
        },
      };

      // Mock XRSession
      const mockXRSession = {
        requestReferenceSpace: () => Promise.resolve({}),
        requestHitTestSource: () => Promise.resolve({}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestAnimationFrame: (callback: any) => {
          // 実際のブラウザの挙動を模倣するために、少し遅延を入れてからコールバックを呼び出す
          setTimeout(() => callback(0, mockXRFrame), 16); // 16msはだいたい60fps
          return 0; // requestAnimationFrameはIDを返すので、ダミーのIDを返す
        },
        end: () => Promise.resolve(),
      };

      Object.defineProperty(navigator, 'xr', {
        writable: true,
        value: {
          isSessionSupported: () => Promise.resolve(true),
          requestSession: async () => {
            // 実際のブラウザの挙動を模倣するために、少し遅延を入れる
            await new Promise((resolve) => setTimeout(resolve, 50));
            return mockXRSession;
          },
        },
      });
    });
    await page.goto('/measure', { waitUntil: 'networkidle' });
  });

  // test.afterEach(async ({ page }) => {
  //   await page.evaluate(() => {
  //     // @ts-expect-error - Clean up mock
  //     delete navigator.xr;
  //   });
  // });

  test('should perform a two-point measurement and display the result', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for AR session to be active
    await page.waitForFunction(() => {
      // @ts-expect-error - Test-only access to internal state
      const measureStore = window.useMeasureStore.getState();
      return (
        measureStore.xrSession !== null && measureStore.xrHitTestSource !== null
      );
    });

    // Wait for AR mode to be active (canvas is visible)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Simulate two taps on the canvas
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 200, y: 200 } });

    // Wait for the measurement to be calculated and displayed
    await page.waitForFunction(() => {
      // @ts-expect-error - Test-only access to internal state
      const measureStore = window.useMeasureStore.getState();
      return (
        measureStore.measurement !== null &&
        measureStore.measurement.valueMm > 0
      );
    });

    // The distance between (1,1,1) and (2,2,2) is sqrt(3) which is ~1.732 meters or 173.2 cm.
    const resultText = page.getByText('173.2 cm');
    await expect(resultText).toBeVisible({ timeout: 5000 });
  });

  test('should display the camera view (canvas) when entering measure mode', async ({
    page,
  }) => {
    // The beforeEach block already navigates to /measure and mocks WebXR.
    // We just need to assert that the canvas is visible.
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    // Additionally, check if the canvas has some content (not just a black rectangle)
    // This is a more advanced check and might require comparing screenshots or checking pixel data,
    // but for now, just checking visibility is a good start.
    // For a truly "not black" check, we might need to mock a camera stream or analyze canvas content.
  });

  test('should display measurement with one decimal place in AR mode', async ({
    page,
  }) => {
    // Override hit test positions for this specific test
    await page.evaluate(() => {
      // @ts-expect-error - This is a mock for testing
      window.mockHitTestPositions = [
        { x: 0, y: 0, z: 0 },
        { x: 0.543, y: 0, z: 0 }, // 0.543m distance
      ];
      // @ts-expect-error - This is a mock for testing
      window.hitTestResultsIndex = 0;
    });

    // Wait for AR mode to be active (canvas is visible)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Simulate two taps on the canvas
    await canvas.click({ position: { x: 100, y: 100 } });
    await canvas.click({ position: { x: 200, y: 200 } });

    // Wait for the measurement to be calculated and displayed
    await page.waitForFunction(() => {
      // @ts-expect-error - Test-only access to internal state
      const measureStore = window.useMeasureStore.getState();
      return (
        measureStore.measurement !== null &&
        measureStore.measurement.valueMm > 0
      );
    });

    // Expect the measurement to be displayed as 54.3 cm (one decimal place)
    await expect(page.getByText('54.3 cm')).toBeVisible();
  });
});
