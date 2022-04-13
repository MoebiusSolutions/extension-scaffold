import Tonic from '@optoolco/tonic'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { EsDebugConsoleRibbonPanel } from './ribbon/debug-console-ribbon-panel'
import { EsDebugConsole } from './ribbon/debug-console'
import { EsConsoleLines } from './ribbon/console-lines'

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
}
