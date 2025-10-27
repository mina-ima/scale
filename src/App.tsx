import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './app/HomePage';
import { useMeasureStore } from './store/measureStore';
import { ErrorBoundary } from './app/ErrorBoundary'; // ← 追加

const MeasurePage = lazy(() => import('./app/MeasurePage'));
const GrowthRecordPage = lazy(() => import('./app/GrowthRecordPage'));

function App() {
  const { setScale, setIsCvReady } = useMeasureStore();

  useEffect(() => {
    // OpenCV.jsの初期化をポーリングで待機
    const intervalId = setInterval(() => {
      // `window.cv` が存在し、`onRuntimeInitialized` がまだ設定されていない場合
      if ((window as any).cv && !(window as any).cv.onRuntimeInitialized) {
        (window as any).cv.onRuntimeInitialized = () => {
          console.log('OpenCV.js is ready.');
          setIsCvReady(true);
          // 初期化が完了したら、ポーリングを停止
          clearInterval(intervalId);
        };
      } else if ((window as any).cv?.onRuntimeInitialized) {
        // すでに初期化が完了している場合もポーリングを停止
        clearInterval(intervalId);
      }
    }, 100); // 100msごとにチェック

    return () => {
      clearInterval(intervalId);
    };
  }, [setIsCvReady]);

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
