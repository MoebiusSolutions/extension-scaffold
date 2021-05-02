import type { ExtensionScaffoldApi } from '../../../es-api/es-api'
import './app-root';

async function addBottomPanel(api: ExtensionScaffoldApi) {
  const div = await api.addPanel({
    id: 'ext.example.lit-element',
    location: 'bottom'
  })

  const app = document.createElement('app-root')
  div.appendChild(app)
}

export function activate(scaffold: ExtensionScaffoldApi) {
  console.log('lit-element activate', scaffold)
  scaffold.ping()

  addBottomPanel(scaffold)
}
