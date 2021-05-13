import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MyPanel } from './MyPanel';
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'

export function activate(scaffold: ExtensionScaffoldApi) {
  function onPanelAdded(div: HTMLDivElement) {
    div.style.height = '100%'
    div.style.width = '100%'
    ReactDOM.render(
      <React.StrictMode>
        <MyPanel es={scaffold} />
      </React.StrictMode>,
      div
    );
  }

  console.log('rollup extension activate', scaffold)

  scaffold.addPanel({
    id: 'ext.example.rollup',
    title: 'Rollup Left',
    location: 'left',
    resizeHandle: true,
  }).then(onPanelAdded)
}
