import Tonic from '@optoolco/tonic'
import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import { EsDebugConsoleRibbonPanel } from './ribbon/debug-console-ribbon-panel'
import { EsDebugConsole } from './ribbon/debug-console'
import { EsConsoleLines } from './ribbon/console-lines'
import { onDevTools } from '@moesol/es-iframe-to-dev-ext'

//
// Collects console output and unhandled errors into a ring buffer
//
export async function activate(scaffold: ExtensionScaffoldApi) {
  Tonic.add(EsDebugConsoleRibbonPanel)
  Tonic.add(EsDebugConsole)
  Tonic.add(EsConsoleLines)

  const div = scaffold.chrome.ribbonBar.claimRibbonPanel('debug.console')
  if (!div) { return }
  
  const s = document.createElement('es-debug-console-ribbon-panel')
  div.innerText = ''
  div.appendChild(s)

  //
  // Subscribe console log messages from other sources
  //
  const a: any = s
  onDevTools('extension-scaffold.console.log', (_, payload) => {
    a.logPush(payload.level, payload.args)
  })
}
