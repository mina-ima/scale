import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import GrowthMeasurementTabContent from './GrowthMeasurementTabContent';
import { generateFileName } from '../utils/fileUtils'; // Import the util

const GrowthRecordPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const tabs = [
    {
      label: '身長',
      content: (
        <GrowthMeasurementTabContent
          mode="shinchou"
          generateFileName={generateFileName} // Pass the raw function
        />
      ),
    },
    {
      label: '足',
      content: (
        <GrowthMeasurementTabContent
          mode="ashi"
          generateFileName={generateFileName} // Pass the raw function
        />
      ),
    },
    {
      label: '手',
      content: (
        <GrowthMeasurementTabContent
          mode="te"
          generateFileName={generateFileName} // Pass the raw function
        />
      ),
    },
    {
      label: '体重',
      content: <div className="p-4">体重入力のコンテンツ</div>,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">成長記録モード</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default GrowthRecordPage;
