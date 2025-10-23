import React, { useCallback, useEffect } from 'react';
import MeasurePage from './MeasurePage';
import { useMeasureStore, MeasureMode } from '../store/measureStore';
import { generateFileName, saveImageToDevice } from '../utils/fileUtils';
import { ItemKey } from '../utils/fileUtils';
import Tabs from '../components/Tabs';

import { calculate2dDistance } from '../core/measure/calculate2dDistance';

interface GrowthMeasurementTabContentProps {
  mode: ItemKey;
}

const GrowthMeasurementTabContent: React.FC<GrowthMeasurementTabContentProps> = ({ mode }) => {
  const { measurement, points, getCanvasBlobFunction, addPoint, clearPoints, setMeasurement } = useMeasureStore();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Dummy useEffect to simulate canvas drawing for tests
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // Simulate drawing points for tests
        if (points.length > 0) {
          ctx.fillStyle = 'red';
          points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
        if (measurement?.valueCm) {
          ctx.font = '20px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(`${measurement.valueCm} cm`, 10, 50);
        }
      }
    }
  }, [points, measurement]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (points.length === 2) {
        clearPoints();
        addPoint({ x, y });
      } else {
        addPoint({ x, y });
      }
    },
    [points, addPoint, clearPoints]
  );

  const composeAndSaveImage = useCallback(async (saveMode: ItemKey) => {
    console.log('composeAndSaveImage called in GrowthMeasurementTabContent');
    if (!measurement?.valueMm || !points.length) {
      console.log('composeAndSaveImage: Pre-conditions not met.', {
        measurement: measurement?.valueMm,
        pointsLength: points.length,
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (blob) {
        const fileName = generateFileName(
          saveMode,
          measurement.valueMm,
          'cm', // Always 'cm' for growth measurements
          measurement.dateISO || new Date().toISOString().split('T')[0]
        );
        console.log('Generated fileName:', fileName);
        await saveImageToDevice(blob, fileName);
      }
    });
  }, [measurement, points, canvasRef]);

  useEffect(() => {
    if (points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      const distance = calculate2dDistance(p1, p2);
      setMeasurement({ valueCm: distance / 10, valueMm: distance, dateISO: new Date().toISOString().split('T')[0] });
    } else if (points.length === 0) {
      setMeasurement(null);
    }
  }, [points, setMeasurement]);

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        data-testid={`growth-record-canvas-${mode}`}
        className="absolute top-0 left-0 w-full h-full z-0 bg-gray-200"
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleClick}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => composeAndSaveImage(mode)}
        >
          {mode === 'shinchou' && '身長保存'}
          {mode === 'te' && '手保存'}
          {mode === 'ashi' && '足保存'}
        </button>
      </div>
    </div>
  );
};

export default GrowthMeasurementTabContent;