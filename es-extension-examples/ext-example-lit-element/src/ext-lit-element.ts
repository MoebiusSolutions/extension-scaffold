import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import './app-root';
import './ribbon-view-section1'

async function addBottomPanel(api: ExtensionScaffoldApi) {
  const div = await api.chrome.panels.addPanel({
    id: 'ext.example.lit-element',
    location: 'bottom-bar',
    title: 'Lit Element',
    resizeHandle: true,
  })

  const app = document.createElement('app-root')
  div.appendChild(app)
}

function doRibbon(api: ExtensionScaffoldApi) {
  const div = api.chrome.ribbonBar.claimRibbonPanel('view.section1')
  if (!div) { return }
  const el = document.createElement('lit-view-section')
  div.innerText = ''
  div.appendChild(el)
}

export async function activate(scaffold: ExtensionScaffoldApi) {
  doRibbon(scaffold)
  await addBottomPanel(scaffold)
}
