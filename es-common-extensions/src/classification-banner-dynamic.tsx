import React from 'react';
import ReactDOM from 'react-dom';
import type { AddPanelOptions, ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';
import { ClassificationBannerDynamic } from './ClassificationBannerDynamic';
import { buildBanner } from "./ClassificationBannerDynamic";
import type { UserInfo } from "./ClassificationBannerDynamic"

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
  let userData = await buildBanner();
  const panelDiv = await doPanel(scaffold, {
    id: 'es.common.classification.dynamic.banner.header',
    location: 'header'
  }, <ClassificationBannerDynamic es={scaffold} userInfo={userData} />)
  claimStyleFromHeadElement(panelDiv, '#es.common.classification.dynamic.banner')
}
async function doFooter(scaffold: ExtensionScaffoldApi) {
  let userData = await buildBanner();
  const panelDiv = await doPanel(scaffold, {
    id: 'es.common.classification.dynamic.banner.footer',
    location: 'footer'
  }, <ClassificationBannerDynamic es={scaffold} userInfo={userData} />)
  claimStyleFromHeadElement(panelDiv, '#es.common.classification.dynamic.banner')
}

export let activatedAtUrl = ''
export async function activate(scaffold: ExtensionScaffoldApi, url: string) {
  activatedAtUrl = url

  await doHeader(scaffold)
  await doFooter(scaffold)
}
