import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Root element not found. Make sure index.html has <div id='root'></div>");
}

const root = ReactDOM.createRoot(container);

root.render(<App />);

// Optional performance monitoring
reportWebVitals();