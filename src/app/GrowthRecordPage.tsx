import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import WeightInputForm from '../components/WeightInputForm';
import GrowthMeasurementTabContent from './GrowthMeasurementTabContent';
import { generateFileName, saveImageToDevice } from '../utils/fileUtils'; // Import the util

const tabItems = [
  {
    id: 'shinchou',
    label: '身長',
    content: <GrowthMeasurementTabContent mode="shinchou" />,
  },
  {
    id: 'ashi',
    label: '足',
    content: <GrowthMeasurementTabContent mode="ashi" />,
  },
  {
    id: 'te',
    label: '手',
    content: <GrowthMeasurementTabContent mode="te" />,
  },
  {
    id: 'weight',
    label: '体重',
    content: (
      <WeightInputForm
        onSubmit={(weight) => {
          // setToastMessage(`体重 ${weight} kg を記録しました。`);
          // setShowToast(true);
        }}
      />
    ),
  },
];

const GrowthRecordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shinchou');

  return (
    <div className="relative flex flex-col h-screen w-full">
      <h1 className="text-center text-xl font-bold p-4 bg-gray-100 shadow-md">
        成長記録モード
      </h1>
      <div className="flex-grow">
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabClick={(id) => setActiveTab(id)}
        />
      </div>
    </div>
  );
};

export default GrowthRecordPage;
