import { Point } from '../fallback/utils';

export const drawMeasurementLine = (
  context: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  color: string = '#FF0000', // Default to red
  radius: number = 5 // Radius for endpoint circles
): void => {
  context.beginPath();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 2; // Example line width

  // Draw line
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.stroke();

  // Draw circles at endpoints
  context.beginPath();
  context.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.arc(p2.x, p2.y, radius, 0, Math.PI * 2);
  context.fill();
};
