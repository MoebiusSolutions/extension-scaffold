import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import './app-root';

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

export async function activate(scaffold: ExtensionScaffoldApi) {
  addBottomPanel(scaffold)
}
