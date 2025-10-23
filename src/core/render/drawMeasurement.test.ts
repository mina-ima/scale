import { describe, it, expect, vi } from 'vitest';
import { drawMeasurementLine, drawMeasurementLabel } from './drawMeasurement';
import * as colorUtils from '../../utils/colorUtils';

// Mock the color utility
vi.mock('../../utils/colorUtils', () => ({
  getOptimalTextColorForRegion: vi.fn(),
}));

describe('drawMeasurement', () => {
  const getMockContext = () => {
    const mockCtx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([0, 0, 0, 255]),
      })),
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      textAlign: '',
      textBaseline: '',
    };
    return mockCtx as unknown as CanvasRenderingContext2D;
  };

  describe('drawMeasurementLine', () => {
    it('should draw a line and two points', () => {
      const ctx = getMockContext();
      const p1 = { x: 10, y: 20 };
      const p2 = { x: 110, y: 120 };

      drawMeasurementLine(ctx, p1, p2);

      expect(ctx.beginPath).toHaveBeenCalledTimes(1);
      expect(ctx.moveTo).toHaveBeenCalledWith(p1.x, p1.y);
      expect(ctx.lineTo).toHaveBeenCalledWith(p2.x, p2.y);
      expect(ctx.stroke).toHaveBeenCalledOnce();
    });
  });

  describe('drawMeasurementLabel', () => {
    it('should determine optimal text color and draw text with background', () => {
      const ctx = getMockContext();
      const text = '123.4 cm';
      const x = 150;
      const y = 100;
      const mockTextColor = '#000000';

      // Setup mock return value
      const mockedGetColor = vi.spyOn(
        colorUtils,
        'getOptimalTextColorForRegion'
      );
      mockedGetColor.mockReturnValue(mockTextColor);

      drawMeasurementLabel(ctx, text, x, y);

      // Verify getImageData is called for the background area
      expect(ctx.getImageData).toHaveBeenCalledOnce();
      const FONT_SIZE = 48;
      const TEXT_PADDING = 10;
      const textWidth = 100; // from mock measureText
      expect(ctx.getImageData).toHaveBeenCalledWith(
        x - textWidth / 2 - TEXT_PADDING,
        y - FONT_SIZE / 2 - TEXT_PADDING,
        textWidth + TEXT_PADDING * 2,
        FONT_SIZE + TEXT_PADDING * 2
      );

      // Verify the color utility was called
      expect(mockedGetColor).toHaveBeenCalledOnce();

      // Verify background and text are drawn with the correct color
      expect(ctx.fillRect).toHaveBeenCalledOnce();
      expect(ctx.fillText).toHaveBeenCalledOnce();
      expect(ctx.fillStyle).toBe(mockTextColor);
      expect(ctx.fillText).toHaveBeenCalledWith(text, x, y);
    });
  });
});
