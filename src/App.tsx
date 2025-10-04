import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './app/HomePage';
import MeasurePage from './app/MeasurePage';
import GrowthRecordPage from './app/GrowthRecordPage';
import { useMeasureStore } from './store/measureStore';

function App() {
  const { setScale } = useMeasureStore();

  useEffect(() => {
    // @ts-ignore
    if (window.isPlaywrightTest) {
      // @ts-ignore
      window.setScale = setScale;
      // @ts-ignore
      window.useMeasureStore = useMeasureStore;
    }
  }, [setScale]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/measure" element={<MeasurePage />} />
      <Route path="/growth-record" element={<GrowthRecordPage />} />
    </Routes>
  );
}

export default App;
