import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';

// App.tsx 側で <Routes> を持つ前提なので、親は "/*" と等価の "path: '*'" にする
// ※ v7 では Route path="*" が推奨。ここで App の内部ルーティングに丸投げする。
const router = createBrowserRouter(
  [
    { path: '*', element: <App /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
