import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary fullScreen>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find root element');
}
