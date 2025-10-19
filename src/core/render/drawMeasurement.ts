import { Point } from '../fallback/utils';
import { getOptimalTextColorForRegion } from '../../utils/colorUtils';

const TEXT_BACKGROUND_COLOR = 'rgba(255, 255, 255, 0.7)';
const TEXT_PADDING = 10;

export const drawMeasurementPoint = (
  context: CanvasRenderingContext2D,
  p: Point,
  color: string = '#FF007F',
  radius: number = 10
): void => {
  context.beginPath();
  context.fillStyle = color;
  context.arc(p.x, p.y, radius, 0, Math.PI * 2);
  context.fill();
};

export const drawMeasurementLine = (
  context: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  color: string = '#FF007F', // Default to a bright pink
  lineWidth: number = 5
): void => {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.stroke();
};

export const drawMeasurementLabel = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number = 48,
  fontFamily: string = 'sans-serif'
): void => {
  context.font = `${fontSize}px ${fontFamily}`;
  const textMetrics = context.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize; // Approximation

  const textX = x - textWidth / 2;
  const textY = y - textHeight / 2;

  // Get the image data behind the text area to determine the best color
  const imageData = context.getImageData(
    textX - TEXT_PADDING,
    textY - TEXT_PADDING,
    textWidth + TEXT_PADDING * 2,
    textHeight + TEXT_PADDING * 2
  );

  // Determine the best text color based on the background
  const textColor = getOptimalTextColorForRegion(imageData);

  // Draw a semi-transparent background for the text for better readability
  context.fillStyle = TEXT_BACKGROUND_COLOR;
  context.fillRect(
    textX - TEXT_PADDING,
    textY - TEXT_PADDING,
    textWidth + TEXT_PADDING * 2,
    textHeight + TEXT_PADDING * 2
  );

  // Draw the text
  context.fillStyle = textColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, x, y);
};
