import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

import type { ExtensionScaffoldApi } from '../../../es-api/es-api'

export function activate(scaffold: ExtensionScaffoldApi) {
    console.log('my-extension activate', scaffold)
    scaffold.ping()

    scaffold.addPanel({
      title: 'Ext example-snowpack',
      location: 'center'
    }).then(onPanelAdded)
}

function onPanelAdded(div: HTMLDivElement) {
    console.log('got a div', div)
    ReactDOM.render(
        <React.StrictMode>
          <MyPanel />
        </React.StrictMode>,
        div
      );
}
