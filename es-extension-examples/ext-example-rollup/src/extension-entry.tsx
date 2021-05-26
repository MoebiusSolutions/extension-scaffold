import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MyPanel } from './MyPanel';
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'

export async function activate(scaffold: ExtensionScaffoldApi) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyPanel es={scaffold} />
      </React.StrictMode>,
      div
    );
  }

  console.log('rollup extension activate', scaffold)

  const span = document.createElement('span')
  const svg = <svg className="use-fill" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
    <path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1l8.05-9.12A8.251 8.251 0 1 0 15.25.01V0zm0 15a6.75 6.75 0 1 1 0-13.5a6.75 6.75 0 0 1 0 13.5z"/>
  </svg>
  ReactDOM.render(svg, span)

  scaffold.addPanel({
    id: 'ext.example.rollup',
    title: 'Rollup Left',
    icon: span,
    location: 'left',
    resizeHandle: true,
  }).then(onPanelAdded)
}
