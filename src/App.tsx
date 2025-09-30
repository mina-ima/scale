import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './app/HomePage';
import MeasurePage from './app/MeasurePage';
import GrowthRecordPage from './app/GrowthRecordPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/measure" element={<MeasurePage />} />
      <Route path="/growth-record" element={<GrowthRecordPage />} />
    </Routes>
  );
}

export default App;
