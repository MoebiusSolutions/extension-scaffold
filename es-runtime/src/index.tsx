import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { loadExtensions } from './controllers/ExtensionController';
import './index.css';
import { InShadow } from './InShadow';

function setupMainPanel() {
  const inPanel = document.createElement('div')
  inPanel.innerText = 'this is a test'

  const el = document.getElementById('main-panel')
  if (!el) {
    throw new Error('Could not find main-panel')
  }
  el.attachShadow({ mode: 'open'})
  const shadow = el.shadowRoot

  if (!shadow) {
    throw new Error('Shadow root did not attach')
  }
  shadow.appendChild(inPanel)

  ReactDOM.render(
    <React.StrictMode>
      <InShadow />
    </React.StrictMode>,
    inPanel
  );
  
}

setupMainPanel()
loadExtensions()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
