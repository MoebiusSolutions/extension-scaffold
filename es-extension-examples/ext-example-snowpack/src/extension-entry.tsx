import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

import type { ExtensionScaffoldApi } from '../../../es-api/es-api'

export function activate(scaffold: ExtensionScaffoldApi) {
  function onPanelAdded(div: HTMLDivElement) {
    console.log('got a div', div)
    ReactDOM.render(
        <React.StrictMode>
          <MyPanel es={scaffold}/>
        </React.StrictMode>,
        div
      );
  }
  console.log('my-extension activate', scaffold)
  scaffold.ping()

  scaffold.addPanel({
    id: 'ext.example.snowpack',
    location: 'center'
  }).then(onPanelAdded)
}
