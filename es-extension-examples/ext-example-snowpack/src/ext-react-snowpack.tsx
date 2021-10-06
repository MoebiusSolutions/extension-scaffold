import React from 'react';
import ReactDOM from 'react-dom';
import { MyPanel } from './MyPanel';

import type { AddPanelOptions, ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { Header } from './Header';
import { Ribbon } from './Ribbon';
import { AboveLeft } from './AboveLeft'
import { Left } from './Left'
import { Footer } from './Footer';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';
import { Bottom } from './Bottom';

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

async function doRibbon(scaffold: ExtensionScaffoldApi) {
  return await doPanel(scaffold, {
    id: 'ext.snowpack.ribbon',
    location: 'top-bar',
    initialWidthOrHeight: '',
  }, <Ribbon es={scaffold} />)
}

async function doAboveLeft(scaffold: ExtensionScaffoldApi) {
  return await doPanel(scaffold, {
    id: 'ext.snowpack.above.left',
    location: 'above-left',
  }, <AboveLeft es={scaffold} />)
}

async function doBottom(scaffold: ExtensionScaffoldApi) {
  return await doPanel(scaffold, {
    id: 'ext.snowpack.bottom',
    location: 'bottom',
    title: 'Time Slider'
  }, <Bottom es={scaffold} />)
}

async function doLeft(scaffold: ExtensionScaffoldApi) {
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
    location: 'left',
    resizeHandle: true,
  }, <Left es={scaffold} />)
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

async function doActivate(scaffold: ExtensionScaffoldApi) {
  await doRibbon(scaffold)
  // We add center from the left panel as a demo of doing that...
  // addCenterPanel(scaffold)
  await doHeader(scaffold)
  await doFooter(scaffold)
  await doBottom(scaffold)
  await doAboveLeft(scaffold)
  await doLeft(scaffold)
}

export async function activate(scaffold: ExtensionScaffoldApi, url: string) {
  return await doActivate(scaffold)
}
