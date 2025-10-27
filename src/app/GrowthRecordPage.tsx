import React from 'react';
import GrowthMeasurementTabContent from './GrowthMeasurementTabContent';

const GrowthRecordPage: React.FC = () => {
  return (
    <div className="relative flex flex-col h-screen w-full">
      <h1 className="text-center text-xl font-bold p-4 bg-gray-100 shadow-md">
        成長記録モード
      </h1>
      <div className="flex-grow relative">
        {/* GrowthMeasurementTabContentのmodeプロパティは削除 */}
        <GrowthMeasurementTabContent mode={null} />
      </div>
    </div>
  );
};

export default GrowthRecordPage;

export default GrowthRecordPage;
