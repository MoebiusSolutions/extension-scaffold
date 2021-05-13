import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';

// import reportWebVitals from './reportWebVitals';
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

export async function activate(scaffold) {
  console.log('webpack activate', scaffold)
  const div = await scaffold.addPanel({
    id: 'ext.example.webpack',
    location: 'right',
    resizeHandle: true,
  })
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    div
  );
}
