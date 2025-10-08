import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './app/HomePage';
import MeasurePage from './app/MeasurePage';
import MeasureUI from './app/MeasureUI';
import GrowthRecordPage from './app/GrowthRecordPage';
import { useMeasureStore } from './store/measureStore';

function App() {
  const { setScale } = useMeasureStore();

  useEffect(() => {
    if (window.isPlaywrightTest) {
      window.setScale = setScale;
      window.useMeasureStore = useMeasureStore;
    }
  }, [setScale]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/measure"
        element={(
          <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <MeasurePage />
            <MeasureUI />
          </div>
        )}
      />
      <Route path="/growth-record" element={<GrowthRecordPage />} />
    </Routes>
  );
}

export default App;
