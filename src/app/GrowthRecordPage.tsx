import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import WeightInputForm from '../components/WeightInputForm';
import GrowthMeasurementTabContent from './GrowthMeasurementTabContent';
import { generateFileName } from '../utils/fileUtils'; // Import the util

const GrowthRecordPage: React.FC = () => {
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

    const [activeTab, setActiveTab] = useState('shinchou');

  

    const tabItems = [

      {

        id: 'shinchou',

        label: '身長',

      },

      {

        id: 'ashi',

        label: '足',

      },

      {

        id: 'te',

        label: '手',

      },

      {

        id: 'weight',

        label: '体重',

      },

    ];

  

    const renderContent = () => {

      switch (activeTab) {

        case 'shinchou':

        case 'ashi':

        case 'te':

          return (

            <GrowthMeasurementTabContent

              mode={activeTab as ItemKey}

            />

          );

        case 'weight':

          return (

            <WeightInputForm

              onSubmit={(weight) => {

                setToastMessage(`体重 ${weight} kg を記録しました。`);

                setShowToast(true);

              }}

            />

          );

        default:

          return null;

      }

    };

  

    return (

      <div className="container mx-auto p-4 flex flex-col h-screen">

        <div className="flex-grow">

          {renderContent()}

        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-2">

          <Tabs items={tabItems} onTabChange={setActiveTab} />

        </div>

        {showToast && (

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">

            {toastMessage}

          </div>

        )}

      </div>

    );

  };

export default GrowthRecordPage;
