import { test, expect } from '@playwright/test';

test.describe('Fallback Mechanism', () => {
  test('should display camera denied message and photo upload on camera permission denial', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    // Mock WebXR unavailability
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        get: () => ({
          getUserMedia: async () => {
            const error = new DOMException(
              'Permission denied',
              'NotAllowedError'
            );
            throw error;
          },
        }),
      });
    });

    // Mock camera permission to be denied
    await page
      .context()
      .grantPermissions(['camera'], { permissions: ['camera'], mode: 'deny' });

    await page.addInitScript(() => (window.isPlaywrightTest = true));
    await page.goto('/measure', {
      waitUntil: 'networkidle',
    });

    // Expect camera denied message
    await expect(
      page.getByText('カメラへのアクセスが拒否されました。')
    ).toBeVisible();
    await expect(
      page.getByText('ブラウザの設定でカメラアクセスを許可してください。')
    ).toBeVisible();

    // Expect retry button
    await expect(page.locator('label:has-text("写真を選択")')).toBeVisible();
  });

  test('should display WebXR not supported message and photo upload on WebXR unavailability', async ({
    page,
  }) => {
    // Mock navigator.xr to be undefined to simulate WebXR unavailability
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'xr', {
        writable: true,
        value: undefined,
      });
    });

    await page.goto('/measure', {
      waitUntil: 'networkidle',
    });

    // Expect WebXR not supported message
    await expect(
      page.getByText('お使いの端末ではAR非対応です。写真で計測に切り替えます。')
    ).toBeVisible();

    // Expect photo upload input as fallback
    await expect(page.locator('label:has-text("写真を選択")')).toBeVisible();
  });

  test('should calculate distance correctly using an A4 paper as reference', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addInitScript(() => (window.isPlaywrightTest = true));
    await page.goto('/measure', {
      waitUntil: 'networkidle',
    });

    // Wait for window.setScale to be available
    await page.waitForFunction(() => typeof window.setScale === 'function');

    // Mock WebXR unavailability
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'xr', {
        value: undefined,
        writable: true,
      });
    });

    // Mock the scale to simulate A4 detection
    await page.evaluate(async () => {
      // @ts-ignore
      window.setScale({
        source: 'a4',
        mmPerPx: 1, // 1 pixel = 1mm
        confidence: 1,
      });
    });

    // Wait for the scale to be applied in the component
    await page.waitForFunction(() => {
      // @ts-ignore
      const scale = window.useMeasureStore.getState().scale;
      return scale !== null && scale.source === 'a4';
    });

    // Simulate photo upload UI interaction (even if actual processing is mocked)
    const fileInput = page.locator('label:has-text("写真を選択")');
    await expect(fileInput).toBeVisible();

    // Simulate two clicks on the canvas
    const canvas = page.getByTestId('measure-canvas');
    await canvas.click({ position: { x: 10, y: 10 } });
    await canvas.click({ position: { x: 110, y: 10 } }); // 100px distance

    // Assert the result: 100px distance with 1mm/px scale should be 100mm = 10.0cm
    await expect(page.getByText('10.0 cm')).toBeVisible();
  });

  test('should calculate distance correctly using a coin as reference', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addInitScript(() => (window.isPlaywrightTest = true));
    await page.goto('/measure', {
      waitUntil: 'networkidle',
    });

    // Mock WebXR unavailability
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'xr', {
        value: undefined,
        writable: true,
      });
    });

    // Mock the scale to simulate 10-yen coin detection (23.5mm diameter)
    // Assuming the coin appears as 50px in the image, so scale is 23.5 / 50 = 0.47 mm/px
    await page.evaluate(async () => {
      // @ts-ignore
      window.setScale({
        source: 'coin-10',
        mmPerPx: 0.47,
        confidence: 1,
      });
    });

    // Wait for the scale to be applied in the component
    await page.waitForFunction(() => {
      // @ts-ignore
      const scale = window.useMeasureStore.getState().scale;
      return scale !== null && scale.source === 'coin-10';
    });

    // Simulate two clicks on the canvas
    const canvas = page.getByTestId('measure-canvas');
    await canvas.click({ position: { x: 20, y: 20 } });
    await canvas.click({ position: { x: 120, y: 20 } }); // 100px distance

    // Assert the result: 100px * 0.47 mm/px = 47mm = 4.7cm
    await expect(page.getByText('4.7 cm')).toBeVisible();
  });
});
