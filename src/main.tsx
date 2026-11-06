import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'shell/app/app';
import { BrowserRouter } from 'react-router-dom';

// Ensure process.env is available for legacy bundle references
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || {
    env: { NODE_ENV: 'production', PUBLIC_URL: '' }
  };
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
