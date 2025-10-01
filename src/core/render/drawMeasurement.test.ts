import { drawMeasurementLine } from './drawMeasurement';
import { Point } from '../fallback/utils';

describe('drawMeasurementLine', () => {
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      closePath: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
    } as unknown as CanvasRenderingContext2D; // Cast to mock context
  });

  it('should call beginPath, moveTo, lineTo, and stroke for the line', () => {
    const p1: Point = { x: 10, y: 10 };
    const p2: Point = { x: 90, y: 90 };
    drawMeasurementLine(mockContext, p1, p2);

    expect(mockContext.beginPath).toHaveBeenCalledTimes(3);
    expect(mockContext.moveTo).toHaveBeenCalledWith(p1.x, p1.y);
    expect(mockContext.lineTo).toHaveBeenCalledWith(p2.x, p2.y); // Corrected typo
    expect(mockContext.stroke).toHaveBeenCalledTimes(1);
  });

  it('should call beginPath, arc, and fill for the endpoint circles', () => {
    const p1: Point = { x: 10, y: 10 };
    const p2: Point = { x: 90, y: 90 };
    const radius = 5;
    drawMeasurementLine(mockContext, p1, p2, '#00FF00', radius);

    expect(mockContext.arc).toHaveBeenCalledWith(
      p1.x,
      p1.y,
      radius,
      0,
      Math.PI * 2
    );
    expect(mockContext.arc).toHaveBeenCalledWith(
      p2.x,
      p2.y,
      radius,
      0,
      Math.PI * 2
    );
    expect(mockContext.fill).toHaveBeenCalledTimes(2); // One for each circle
  });

  it('should use the specified color for stroke and fill', () => {
    const p1: Point = { x: 10, y: 10 };
    const p2: Point = { x: 90, y: 90 };
    const color = '#0000FF';
    drawMeasurementLine(mockContext, p1, p2, color);

    expect(mockContext.strokeStyle).toBe(color);
    expect(mockContext.fillStyle).toBe(color);
  });
});
