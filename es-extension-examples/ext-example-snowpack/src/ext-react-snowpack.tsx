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

/**
 * Reduces React broiler plate code for adding an extension panel.
 * 
 * @param scaffold
 * @param options 
 * @param component 
 * @returns 
 */
async function doPanel(scaffold: ExtensionScaffoldApi, options: AddPanelOptions, component: JSX.Element) {
  const panelDiv = await scaffold.addPanel(options)

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
    location: 'top',
    initialWidthOrHeight: '',
  }, <Ribbon es={scaffold} />)
}

async function doAboveLeft(scaffold: ExtensionScaffoldApi) {
  return await doPanel(scaffold, {
    id: 'ext.snowpack.above.left',
    location: 'above-left',
  }, <AboveLeft es={scaffold} />)
}

async function doLeft(scaffold: ExtensionScaffoldApi) {
  return await doPanel(scaffold, {
    id: 'ext.snowpack.left',
    title: 'Snowpack Left',
    location: 'left',
    resizeHandle: true,
  }, <Left es={scaffold} />)
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

async function doActivate(scaffold: ExtensionScaffoldApi) {
  await doRibbon(scaffold)
  // We add center from the left panel as a demo of doing that...
  // addCenterPanel(scaffold)
  await addMap(scaffold)
  await doHeader(scaffold)
  await doFooter(scaffold)
  await doAboveLeft(scaffold)
  await doLeft(scaffold)
}

export function activate(scaffold: ExtensionScaffoldApi) {
  console.log('my-extension activate', scaffold)

  doActivate(scaffold).catch(console.error)
}
