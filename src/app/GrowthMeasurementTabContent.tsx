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
  const { measurement, points } = useMeasureStore();

  const composeAndSaveImage = useCallback(async () => {
    console.log('composeAndSaveImage called in GrowthMeasurementTabContent');
    if (!measurement?.valueMm || !points.length) {
      console.log('composeAndSaveImage: Pre-conditions not met.', {
        measurement: measurement?.valueMm,
        pointsLength: points.length,
      });
      return;
    }

    // MeasurePageのcanvasから画像を取得するロジックが必要
    // ここでは仮に、MeasurePageが最終的な画像をどこかに保持していると仮定するか、
    // またはMeasurePageからcanvasRefなどを取得する仕組みが必要
    // 現状ではMeasurePageの内部にアクセスできないため、この部分は後で調整が必要
    // 一旦、ダミーのBlobを作成して保存処理をテストする
    const dummyCanvas = document.createElement('canvas');
    dummyCanvas.width = 100;
    dummyCanvas.height = 100;
    const dummyCtx = dummyCanvas.getContext('2d');
    if (dummyCtx) {
      dummyCtx.fillStyle = 'red';
      dummyCtx.fillRect(0, 0, 100, 100);
      dummyCtx.fillStyle = 'white';
      dummyCtx.font = '12px Arial';
      dummyCtx.fillText('Dummy Image', 10, 50);
    }

    dummyCanvas.toBlob(
      async (blob) => {
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
      },
      'image/jpeg',
      0.92
    );
  }, [measurement, points, mode]);

  return (
    <div className="relative w-full h-screen">
      <MeasurePage />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={composeAndSaveImage}
        >
          画像を保存
        </button>
      </div>
    </div>
  );
};

export default GrowthMeasurementTabContent;