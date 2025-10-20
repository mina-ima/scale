import React from 'react';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';

interface MeasureTopPanelProps {
  getInstructionText: () => string | null;
}

const MeasureTopPanel: React.FC<MeasureTopPanelProps> = ({ getInstructionText }) => {
  const { measurement, unit } = useMeasureStore();

  return (
    <div className="p-4 pointer-events-auto z-30"> {/* z-indexを高く設定 */}
      <div className="bg-white/80 backdrop-blur p-3 rounded shadow max-w-full">
        <h1 className="text-xl font-bold">計測モード</h1>
        <p className="text-orange-600 text-sm mb-2">{getInstructionText()}</p>
        {measurement?.valueMm && (
          <p className="text-lg font-medium">
            {formatMeasurement(measurement.valueMm, unit)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MeasureTopPanel;
