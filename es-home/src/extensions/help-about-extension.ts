import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import runtimePkg from '@moesol/es-runtime/package.json'

//
// Collects console output and unhandled errors into a ring buffer
//
export async function activate(scaffold: ExtensionScaffoldApi) {
  const div = scaffold.chrome.ribbonBar.claimRibbonPanel('help.about.es-home')
  if (!div) { return }

  div.innerText = ''
  const homePkg = await (await fetch('./version.json')).json()

  const section: any = document.createElement('es-ribbon-section')
  section.setAttribute('label', 'About Runtime')
  div.appendChild(section)

  const items = section.querySelector('.ribbon-section-items')
  items.style.flexDirection = 'column'

  const runtime = document.createElement('div')
  runtime.innerText = `Version: ${runtimePkg.version}`
  const home = document.createElement('div')
  home.innerText = `git hash: ${homePkg.hash}`
  
  items.appendChild(runtime)
  items.appendChild(home)
}
