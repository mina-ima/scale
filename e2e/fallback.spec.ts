import { test, expect } from '@playwright/test';

test.describe('Fallback Mechanism', () => {
  test('should display camera denied message and photo upload on camera permission denial', async ({
    page,
  }) => {
    // Mock camera permission to be denied
    await page
      .context()
      .grantPermissions(['camera'], { permissions: ['camera'], mode: 'deny' });

    await page.goto('http://localhost:5174/measure', {
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
    await expect(page.getByRole('button', { name: '再試行' })).toBeVisible();

    // Expect photo upload input as fallback
    await expect(page.getByLabelText('写真を選択')).toBeVisible();
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

    await page.goto('http://localhost:5174/measure', {
      waitUntil: 'networkidle',
    });

    // Expect WebXR not supported message
    await expect(
      page.getByText('WebXR (AR) is not supported on this device.')
    ).toBeVisible();

    // Expect photo upload input as fallback
    await expect(page.getByLabelText('写真を選択')).toBeVisible();
  });
});
