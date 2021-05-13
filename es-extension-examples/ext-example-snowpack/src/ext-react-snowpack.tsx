import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { Header } from './Header';
import { AboveLeft } from './AboveLeft'
import { Left } from './Left'
import { Footer } from './Footer';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';

// Async example
async function doHeader(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await scaffold.addPanel({
    id: 'ext.snowpack.header',
    location: 'header'
  })

  ReactDOM.render(
    <React.StrictMode>
      <Header es={scaffold} />
    </React.StrictMode>,
    panelDiv
  )
  claimStyleFromHeadElement(panelDiv, '#ext.example.snowpack')
}

async function doFooter(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await scaffold.addPanel({
    id: 'ext.snowpack.footer',
    location: 'footer'
  })

  ReactDOM.render(
    <React.StrictMode>
      <Footer es={scaffold} />
    </React.StrictMode>,
    panelDiv
  )
  claimStyleFromHeadElement(panelDiv, '#ext.example.snowpack')
}

async function doAboveLeft(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await scaffold.addPanel({
    id: 'ext.snowpack.above.left',
    location: 'above-left'
  })

  ReactDOM.render(
    <React.StrictMode>
      <AboveLeft es={scaffold} />
    </React.StrictMode>,
    panelDiv
  )
}

async function doLeft(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await scaffold.addPanel({
    id: 'ext.snowpack.left',
    title: 'Snowpack Left',
    location: 'left',
    resizeHandle: true,
  })

  ReactDOM.render(
    <React.StrictMode>
      <Left es={scaffold} />
    </React.StrictMode>,
    panelDiv
  )
}

async function addMap(scaffold: ExtensionScaffoldApi) {
  const mapUrl = 'http://localhost:8082/map.html?aeo_logo=true&aeo_dc=false&aeo_top=1.9886362552642822&aeo_left=1.9886362552642822&aeo_viewport_w=1745&aeo_viewport_h=961&xdm_e=http%3A%2F%2Flocalhost%3A8082%2F&xdm_c=default3300&xdm_p=4'
  const panelDiv = await scaffold.addPanel({
    id: 'ext.aeolus.map',
    title: 'Snowpack Left',
    location: 'center',
    resizeHandle: true,
    iframeSource: mapUrl,
  })
  console.log('added', panelDiv)
}

export function addCenterPanel(scaffold: ExtensionScaffoldApi) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyPanel es={scaffold}/>
      </React.StrictMode>,
      div
    );
    claimStyleFromHeadElement(div, '#ext.example.snowpack')
  }
  scaffold.addPanel({
    id: 'ext.example.snowpack',
    location: 'center'
  }).then(onPanelAdded).catch(console.error)
}

export function activate(scaffold: ExtensionScaffoldApi) {
  console.log('my-extension activate', scaffold)

  // addCenterPanel(scaffold)
  addMap(scaffold)
  doHeader(scaffold).catch(console.error)
  doFooter(scaffold).catch(console.error)
  // doAboveLeft(scaffold).catch(console.error)
  doLeft(scaffold).catch(console.error)
}
