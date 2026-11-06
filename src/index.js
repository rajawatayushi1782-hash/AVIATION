import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'shell/app/app';
import {BrowserRouter} from "react-router-dom";

// Ensure process.env is available
if (typeof process === 'undefined') {
  window.process = { env: { NODE_ENV: 'production' } };
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();