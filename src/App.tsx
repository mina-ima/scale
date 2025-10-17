import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './app/HomePage';
import { useMeasureStore } from './store/measureStore';
import { ErrorBoundary } from './app/ErrorBoundary'; // ← 追加

const MeasurePage = lazy(() => import('./app/MeasurePage'));
const GrowthRecordPage = lazy(() => import('./app/GrowthRecordPage'));

function App() {
  const { setScale } = useMeasureStore();

  useEffect(() => {
    if (window.isPlaywrightTest) {
      window.setScale = setScale;
      window.useMeasureStore = useMeasureStore;
    }
  }, [setScale]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/measure" element={<MeasurePage />} />
          <Route path="/growth-record" element={<GrowthRecordPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
