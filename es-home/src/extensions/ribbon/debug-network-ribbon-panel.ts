import Tonic from "@optoolco/tonic"
import type { EsDebugNetwork } from "./debug-network"
import { extensionScaffold } from '@gots/es-runtime/build/es-api'

const DEBUG_NETWORK_DISPLAY = 'debug.network.display'

export class EsDebugNetworkRibbonPanel extends Tonic {

  async doOpen() {
    const div = await extensionScaffold.chrome.panels.addPanel({
      id: DEBUG_NETWORK_DISPLAY,
      location: 'modeless',
      initialWidthOrHeight: {
        width: '80em',
        height: '40em'
      }
    })
    const debugNetwork = document.createElement('es-debug-network')
    div.appendChild(debugNetwork as Node)
  }
  doClose() {
    extensionScaffold.chrome.panels.removePanel(DEBUG_NETWORK_DISPLAY)
  }

  click(e: MouseEvent) {
    if (e.target instanceof Element) {
      const target = e.target
      if (e.target.closest('es-ribbon-button[label="Activity"]')) {
        this.doOpen()
      } else if (e.target.closest('[data-name="Clear"]')) {
        // TODO
      }
    }
  }
  connected() {
  }
  styles() {
    return {
      left: {
        textAlign: 'left',
        fontSize: '12px',
      }
    }
  }
  render() {
    this.style.display = 'flex'
    return this.html/*html*/`
      <es-ribbon-section label="Network">
        <es-ribbon-button label="Activity">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5zm8.41 11.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/></svg>
        </es-ribbon-button>
      </es-ribbon-section>
    `
  }
}