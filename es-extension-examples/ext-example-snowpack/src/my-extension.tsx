import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

export function activate(scaffold: any) {
    console.log('my-extension activate', scaffold)
    scaffold.ping()

    scaffold.addPanel('Ext example-snowpack').then(onPanelAdded)
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
