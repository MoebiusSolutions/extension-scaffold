import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MyPanel } from './MyPanel';

export function activate(scaffold: any) {
    console.log('rollup extension activate', scaffold)
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
