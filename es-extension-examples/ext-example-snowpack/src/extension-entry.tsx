import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

import type { ExtensionScaffoldApi } from '../../../es-api/es-api'
import { Header } from './Header';

// Async example
async function doHeader(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await scaffold.claimPanel({
    id: 'ext.snowpack.header',
    location: 'header'
  })

  ReactDOM.render(
    <React.StrictMode>
      <Header es={scaffold}/>
    </React.StrictMode>,
    panelDiv
  )
}

export function addCenterPanel(scaffold: ExtensionScaffoldApi) {
  function onPanelAdded(div: HTMLDivElement) {
    console.log('got a div', div)
    ReactDOM.render(
        <React.StrictMode>
          <MyPanel es={scaffold}/>
        </React.StrictMode>,
        div
      );
  }
  scaffold.claimPanel({
    id: 'ext.example.snowpack',
    location: 'center'
  }).then(onPanelAdded).catch(console.error)
}

export function activate(scaffold: ExtensionScaffoldApi) {
  console.log('my-extension activate', scaffold)
  scaffold.ping()

  addCenterPanel(scaffold)
  doHeader(scaffold).catch(console.error)
}
