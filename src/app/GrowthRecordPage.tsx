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

  

        <div className="relative flex flex-col h-screen w-full">

  

          <div className="flex-grow overflow-auto pb-20"> {/* Tabsの高さ分padding-bottomを追加 */}

  

            {renderContent()}

  

          </div>

  

          

  

          {showToast && (

  

            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50">

  

              {toastMessage}

  

            </div>

  

          )}

  

        </div>

  

      );

  };

export default GrowthRecordPage;
