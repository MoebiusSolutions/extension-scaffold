import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

import type { AddPanelOptions, ExtensionScaffoldApi, Location } from '@moesol/es-runtime/build/es-api'
import { Header } from './Header';
import { Left } from './Left'
import { Footer } from './Footer';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';
import { Bottom } from './Bottom';
import { doClaimRibbon } from './ribbon-panels';
import { addLeftWithCounter } from './LeftWithCounter';
import { addLeftSecurityExample } from './LeftSecurityExample';
import { initialize } from '@moesol/inter-widget-communication';
import { MyModeless } from './MyModeless';
import { MyModal } from './MyModal';

/**
 * Reduces React broiler plate code for adding an extension panel.
 * 
 * @param scaffold
 * @param options 
 * @param component 
 * @returns 
 */
async function doPanel(scaffold: ExtensionScaffoldApi, options: AddPanelOptions, component: JSX.Element) {
  const panelDiv = await scaffold.chrome.panels.addPanel(options)

  ReactDOM.render(
    <React.StrictMode>
      {component}
    </React.StrictMode>,
    panelDiv
  )

  return panelDiv
}

async function doHeader(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await doPanel(scaffold, {
    id: 'ext.snowpack.header',
    location: 'header'
  }, <Header es={scaffold} />)
  claimStyleFromHeadElement(panelDiv, '#ext.example.snowpack')
}

async function doFooter(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await doPanel(scaffold, {
    id: 'ext.snowpack.footer',
    location: 'footer'
  }, <Footer es={scaffold} />)
  claimStyleFromHeadElement(panelDiv, '#ext.example.snowpack')
}

async function doBottom(scaffold: ExtensionScaffoldApi) {
  const defaultLocation = localStorage.getItem('ext.snowpack.bottom') as Location ?? null
  return await doPanel(scaffold, {
    id: 'ext.snowpack.bottom',
    location: 'bottom-bar',
    title: 'Time Slider',
    popOutButton: true,
    dockLocationButton: ["modeless", "left"],
    removeButton: true, // NOTE: if you enable this you should have a way to add the panel
    defaultDockLocation: defaultLocation ? defaultLocation : 'bottom-bar',
    saveDockLocationPreference: (currentLocation: string) => localStorage.setItem('ext.snowpack.bottom', currentLocation) 
  }, <Bottom es={scaffold} />)
}

async function doLeft(scaffold: ExtensionScaffoldApi, forceRight?: boolean) {
  const span = document.createElement('span')
  const icon = <svg className="use-stroke" preserveAspectRatio="xMidYMid meet" viewBox="0 0 15 15">
    <g fill="none">
      <path d="M.5 0v14.5H15M5 2.5H2m6 3H3m5 3H5m10 3H8" />
    </g>
  </svg>
  ReactDOM.render(icon, span)

  return await doPanel(scaffold, {
    id: 'ext.snowpack.left',
    title: 'Snowpack Left',
    icon: span,
    location: forceRight ? 'right' : 'left',
    relocating: forceRight ? true : false,
    popOutButton: false,
  }, <Left es={scaffold} />)
}

export async function moveLeftToRight(scaffold: ExtensionScaffoldApi) {
  scaffold.chrome.panels.removePanel('ext.snowpack.left')
  doLeft(scaffold, true)
}
export async function moveRightToLeft(scaffold: ExtensionScaffoldApi) {
  scaffold.chrome.panels.removePanel('ext.snowpack.left')
  doLeft(scaffold)
}

export function addCenterPanel(scaffold: ExtensionScaffoldApi) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyPanel es={scaffold} />
      </React.StrictMode>,
      div
    );
    claimStyleFromHeadElement(div, '#ext.example.snowpack')
  }
  scaffold.chrome.panels.addPanel({
    id: 'ext.example.snowpack',
    location: 'center'
  }).then(onPanelAdded).catch(console.error)
}

export function addModelessPanel(scaffold: ExtensionScaffoldApi, esId: string) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyModeless es={scaffold} esId={esId} />
      </React.StrictMode>,
      div
    );
    claimStyleFromHeadElement(div, '#ext.example.snowpack')
  }
  scaffold.chrome.panels.addPanel({
    id: esId,
    location: 'modeless',
    resizeHandle: false,
  }).then(onPanelAdded).catch(() => {
    scaffold.chrome.panels.showPanel(esId)
  })
}

export function addDiagonalStaggerPanel(scaffold: ExtensionScaffoldApi, esId: string) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyModeless es={scaffold} esId={esId} />
      </React.StrictMode>,
      div
    );
    claimStyleFromHeadElement(div, '#ext.example.snowpack')
  }
  scaffold.chrome.panels.addPanel({
    id: esId,
    location: 'modeless',
    resizeHandle: false,
    initialWidthOrHeight: {
      width: '30em',
      height: '40em'
    },
    groupId: `diagonalStaggerGroupExample`,
    staggerStrategy: {
      algorithm: 'diagonal',
      firstPosition: { top: '15%', left: '15%' }
    }
  }).then(onPanelAdded).catch(() => {
    scaffold.chrome.panels.showPanel(esId)
  })
}

export function addTiledStaggerPanel(scaffold: ExtensionScaffoldApi, esId: string) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyModeless es={scaffold} esId={esId} />
      </React.StrictMode>,
      div
    );
    claimStyleFromHeadElement(div, '#ext.example.snowpack')
  }
  scaffold.chrome.panels.addPanel({
    id: esId,
    location: 'modeless',
    resizeHandle: false,
    initialWidthOrHeight: {
      width: '30em',
      height: '5em'
    },
    groupId: `tiledStaggerGroupExample`,
    staggerStrategy: {
      algorithm: 'tiled',
      firstPosition: { top: '15%', left: '15%' }
    }
  }).then(onPanelAdded).catch(() => {
    scaffold.chrome.panels.showPanel(esId)
  })
}

export function addModalPanel(scaffold: ExtensionScaffoldApi, esId: string) {
  function onPanelAdded(div: HTMLDivElement) {
    ReactDOM.render(
      <React.StrictMode>
        <MyModal es={scaffold} esId={esId}/>
      </React.StrictMode>,
      div
    );
    claimStyleFromHeadElement(div, '#ext.example.snowpack')
  }
  scaffold.chrome.panels.addPanel({
    id: esId,
    location: 'modal'
  }).then(onPanelAdded).catch(console.error)
}

async function doActivate(scaffold: ExtensionScaffoldApi) {
  doClaimRibbon(scaffold)
  // await doRibbon(scaffold)
  // We add center from the left panel as a demo of doing that...
  // addCenterPanel(scaffold)
  await doHeader(scaffold)
  await doFooter(scaffold)
  await doBottom(scaffold)
  await doLeft(scaffold)
  await addLeftWithCounter(scaffold)
  await addLeftSecurityExample(scaffold)
}

export let activatedAtUrl = ''
export async function activate(scaffold: ExtensionScaffoldApi, url: string) {
  activatedAtUrl = url
  initialize()
  return await doActivate(scaffold)
}