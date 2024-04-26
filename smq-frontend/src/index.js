import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { registerLicense } from '@syncfusion/ej2-base';

setChonkyDefaults({ iconComponent: ChonkyIconFA });
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXtfeXRTRWhfV0R0V0U=');
const root = ReactDOM.createRoot(document.getElementById('root'));
const expiryDate = new Date('2024-04-25');
const today = new Date();
root.render(
  expiryDate > today ? ( // Check if expiry date is in the past
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <div>App functionality limited. Please contact developer for renewal.</div>
  )
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
