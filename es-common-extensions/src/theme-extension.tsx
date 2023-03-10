import React from 'react';
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import { ThemeSelect } from './ThemeSelect';

/**
 * Helper functions to avoid if (div === null) broiler plate.
 */
function claimRibbonThen(scaffold: ExtensionScaffoldApi, id: string, f: (div: HTMLDivElement) => void) {
  const div = scaffold.chrome.ribbonBar.claimRibbonPanel(id)
  if (div === null) {
    console.error('ribbon panel not found', id)
    return
  }
  f(div)
}

function claimRibbonWith(scaffold: ExtensionScaffoldApi, id: string, node: React.ReactNode) {
  claimRibbonThen(scaffold, id, div => {
    ReactDOM.render(<React.StrictMode>{node}</React.StrictMode>,div)
  })
}
  
export let activatedAtUrl = ''
export async function activate(scaffold: ExtensionScaffoldApi, url: string) {
  activatedAtUrl = url

  claimRibbonWith(scaffold, 'display.theme', 
    <ThemeSelect container={ scaffold.gridContainer}/>
  )
}
