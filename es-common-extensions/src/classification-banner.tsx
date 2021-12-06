import React from 'react';
import ReactDOM from 'react-dom';
import type { AddPanelOptions, ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';
import { ClassificationBanner } from './ClassificationBanner';

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
    id: 'es.common.classification.banner.header',
    location: 'header'
  }, <ClassificationBanner es={scaffold} />)
  claimStyleFromHeadElement(panelDiv, '#es.common.classification.banner')
}
async function doFooter(scaffold: ExtensionScaffoldApi) {
  const panelDiv = await doPanel(scaffold, {
    id: 'es.common.classification.banner.footer',
    location: 'footer'
  }, <ClassificationBanner es={scaffold} />)
  claimStyleFromHeadElement(panelDiv, '#es.common.classification.banner')
}

export let activatedAtUrl = ''
export async function activate(scaffold: ExtensionScaffoldApi, url: string) {
  activatedAtUrl = url

  await doHeader(scaffold)
  await doFooter(scaffold)
}
