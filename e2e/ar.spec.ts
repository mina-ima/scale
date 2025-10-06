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

declare global {
  interface Window {
    mockWebXr: {
      startSession: () => void;
      setPlaneDetected: (detected: boolean) => void;
      addHitTestPoint: (point: [number, number, number]) => void;
    };
  }
}

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
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should perform a two-point measurement and display the result', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addInitScript(() => (window.isPlaywrightTest = true));
    // Mock a more complete WebXR API
    await page.evaluate(() => {
      let hitTestResultsIndex = 0;
      const mockHitTestPositions = [
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
          const position = mockHitTestPositions[hitTestResultsIndex];
          hitTestResultsIndex =
            (hitTestResultsIndex + 1) % mockHitTestPositions.length; // Cycle through positions

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
          // Immediately invoke the callback with a mock frame
          callback(0, mockXRFrame);
          return 0;
        },
        end: () => Promise.resolve(),
      };

      Object.defineProperty(navigator, 'xr', {
        writable: true,
        value: {
          isSessionSupported: () => Promise.resolve(true),
          requestSession: () => Promise.resolve(mockXRSession),
        },
      });
    });

    await page.goto('http://localhost:5173/measure', {
      waitUntil: 'networkidle',
    });

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

  test('should display measurement with one decimal place in AR mode', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByText('計測モード').click();
    await page.getByRole('button', { name: 'ARモードを開始' }).click();

    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).mockWebXr.startSession();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).mockWebXr.setPlaneDetected(true);
    });

    await page.mouse.click(100, 100);
    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).mockWebXr.addHitTestPoint([0, 0, 0]);
    });

    await page.mouse.click(200, 200);
    await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).mockWebXr.addHitTestPoint([0.543, 0, 0]); // Simulate 0.543m distance
    });

    // Expect the measurement to be displayed as 54.3 cm (one decimal place)
    await expect(page.getByText(/^\d+\.\d{1} cm$/)).toBeVisible();
    await expect(page.getByText('54.3 cm')).toBeVisible();
  });
});
