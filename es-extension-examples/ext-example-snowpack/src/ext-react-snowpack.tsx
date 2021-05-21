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

  const span = document.createElement('span')
  const svg2 = <svg viewBox="0 0 28 28"><path d="M11.5,0.5C12,0.75 13,2.4 13,3.5C13,4.6 12.33,5 11.5,5C10.67,5 10,4.85 10,3.75C10,2.65 11,2 11.5,0.5M18.5,9C21,9 23,11 23,13.5C23,15.06 22.21,16.43 21,17.24V23H12L3,23V17.24C1.79,16.43 1,15.06 1,13.5C1,11 3,9 5.5,9H10V6H13V9H18.5M12,16A2.5,2.5 0 0,0 14.5,13.5H16A2.5,2.5 0 0,0 18.5,16A2.5,2.5 0 0,0 21,13.5A2.5,2.5 0 0,0 18.5,11H5.5A2.5,2.5 0 0,0 3,13.5A2.5,2.5 0 0,0 5.5,16A2.5,2.5 0 0,0 8,13.5H9.5A2.5,2.5 0 0,0 12,16Z" /></svg>

  ReactDOM.render(svg2, span)

  return await doPanel(scaffold, {
    id: 'ext.snowpack.left',
    title: 'Snowpack Left',
    icon: span,
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

export function activate(scaffold: ExtensionScaffoldApi, url: string) {
  console.log('snowpack extension activated', scaffold, url)

  doActivate(scaffold).catch(console.error)
}
