import { test, expect } from '@playwright/test';

test.describe('Growth Record Mode', () => {
  test('should record height measurement and save image with correct filename', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addInitScript(() => (window.isPlaywrightTest = true));
    await page.goto('/growth-record', {
      waitUntil: 'networkidle',
    });

    // Mock window.showSaveFilePicker to force fallback download
    await page.evaluate(() => {
      Object.defineProperty(window, 'showSaveFilePicker', {
        writable: true,
        value: undefined,
      });
    });

    // Ensure the "身長" tab is selected (default)
    await expect(page.getByRole('tab', { name: '身長' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    // Mock camera stream and getTapCoordinates for consistent testing
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: {
          getUserMedia: () =>
            Promise.resolve({
              getTracks: () => [{ stop: () => {} }],
            } as MediaStream),
        },
        writable: true,
      });
    });

    // Mock getTapCoordinates to return predictable values
    await page.evaluate(() => {
      window.mockGetTapCoordinates = (event: MouseEvent) => {
        if (event.clientX === 100 && event.clientY === 100)
          return { x: 100, y: 100 };
        if (event.clientX === 100 && event.clientY === 200)
          return { x: 100, y: 200 };
        return { x: 0, y: 0 };
      };
    });

    // Mock calculate2dDistance to return a fixed value
    await page.evaluate(() => {
      window.mockCalculate2dDistance = () => {
        // Simulate a distance of 170cm
        return 1700; // 170 cm in mm
      };
    });

    // Mock the scale to be 1mm/px for simplicity
    await page.evaluate(() => {
      window.mockMeasureStoreScale = {
        source: 'none',
        mmPerPx: 1,
        confidence: 1,
      };
      // @ts-expect-error - Test-only access to internal state
      window.setScale(window.mockMeasureStoreScale);
    });

    // Click on the canvas to simulate two points for measurement
    const canvas = page.getByTestId('growth-record-canvas-shinchou');
    await canvas.click({ clientX: 100, clientY: 100 });
    await canvas.click({ clientX: 100, clientY: 200 });

    // Expect the measurement to be displayed
    await expect(
      page
        .getByTestId('growth-record-page-container-shinchou')
        .getByText('170.0 cm')
    ).toBeVisible();

    // Wait for the download to occur
    const downloadPromise = page.waitForEvent('download');

    // Simulate the save action (e.g., by clicking a save button, or it happens automatically)
    // For now, we assume it happens automatically after measurement
    // If there's a specific save button, we'd click it here.

    const download = await downloadPromise;

    // Get the current date for filename assertion
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const expectedDate = `${year}-${month}-${day}`;

    // Assert the filename
    const expectedFilenameRegex = new RegExp(
      `hakattake_${expectedDate}_shinchou_170\.0cm\.jpg`
    );
    expect(download.suggestedFilename()).toMatch(expectedFilenameRegex);

    // You can also save the file to a temporary path if needed for further inspection
    // const path = await download.path();
    // console.log(`Downloaded to: ${path}`);
  });

  test('should record weight measurement and display toast', async ({
    page,
  }) => {
    await page.goto('/growth-record', {
      waitUntil: 'networkidle',
    });

    // Click on the "体重" tab
    await page.getByRole('tab', { name: '体重' }).click();
    await expect(page.getByRole('tab', { name: '体重' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    // Input weight value
    await page.getByLabel('体重 (kg):').fill('25.5');

    // Click save button
    await page.getByRole('button', { name: '保存' }).click();

    // Expect a toast message
    await expect(page.getByText('体重: 25.5 kg, 日付: ')).toBeVisible();
  });
});
