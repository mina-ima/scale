import React, { useCallback, useEffect } from 'react';
import MeasurePage from './MeasurePage';
import { useMeasureStore, MeasureMode } from '../store/measureStore';
import { generateFileName, saveImageToDevice } from '../utils/fileUtils';
import { ItemKey } from '../utils/fileUtils';
import Tabs from '../components/Tabs';

interface GrowthMeasurementTabContentProps {
  mode: ItemKey;
}

const GrowthMeasurementTabContent: React.FC<GrowthMeasurementTabContentProps> = ({ mode }) => {
  const { measurement, points, getCanvasBlobFunction, homography } = useMeasureStore();

  const composeAndSaveImage = useCallback(async (saveMode: ItemKey) => {
    console.log('composeAndSaveImage called in GrowthMeasurementTabContent');
    if (!measurement?.valueMm || !points.length) {
      console.log('composeAndSaveImage: Pre-conditions not met.', {
        measurement: measurement?.valueMm,
        pointsLength: points.length,
      });
      return;
    }

    const blob = await getCanvasBlobFunction?.();

    if (blob) {
      const fileName = generateFileName(
        mode,
        measurement.valueMm,
        'cm', // Always 'cm' for growth measurements
        measurement.dateISO || new Date().toISOString().split('T')[0]
      );
      console.log('Generated fileName:', fileName);
      await saveImageToDevice(blob, fileName);
    }
  }, [measurement, points, mode]);

  return (
    <div className="relative w-full h-screen">
      <MeasurePage />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => composeAndSaveImage('shinchou')}
        >
          身長保存
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => composeAndSaveImage('te')}
        >
          手保存
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => composeAndSaveImage('ashi')}
        >
          足保存
        </button>
      </div>
    </div>
  );
};

export default GrowthMeasurementTabContent;