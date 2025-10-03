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
      page.getByText('お使いの端末ではAR非対応です。写真で計測に切り替えます。')
    ).toBeVisible();

    // Expect photo upload input as fallback
    await expect(page.getByLabelText('写真を選択')).toBeVisible();
  });

  test('should calculate distance correctly using an A4 paper as reference', async ({
    page,
  }) => {
    await page.goto('http://localhost:5174/measure');

    // Mock WebXR unavailability
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'xr', {
        value: undefined,
        writable: true,
      });
    });

    // 1. Create a virtual A4 paper image (SVG)
    const a4_width_mm = 210;
    const a4_height_mm = 297;
    const svg = `
      <svg width="${a4_width_mm}" height="${a4_height_mm}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16">A4</text>
      </svg>
    `;
    const dataURL = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    // 2. Upload the image
    const fileInput = page.getByLabelText('写真を選択');
    const response = await page.evaluate(async (url) => {
      const res = await fetch(url);
      const blob = await res.blob();
      return blob;
    }, dataURL);

    await fileInput.setInputFiles([
      {
        name: 'a4.svg',
        mimeType: 'image/svg+xml',
        buffer: Buffer.from(await response.arrayBuffer()),
      },
    ]);

    // Wait for the image to be processed and scale to be set
    await expect(page.getByText('基準を検出しました: A4')).toBeVisible();

    // 3. Simulate two clicks on the canvas
    const canvas = page.getByTestId('measure-canvas');
    await canvas.click({ position: { x: 10, y: 10 } });
    await canvas.click({ position: { x: 110, y: 10 } }); // 100px distance

    // 4. Assert the result
    // The scale should be roughly 1 (since the SVG is in mm)
    // So, 100px should be ~100mm = 10.0cm
    await expect(page.getByText('10.0 cm')).toBeVisible();
  });
});
