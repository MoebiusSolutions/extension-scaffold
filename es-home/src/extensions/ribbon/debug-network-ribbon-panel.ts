import Tonic from "@optoolco/tonic"
import { extensionScaffold } from '@moesol/es-runtime/build/es-api'

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
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 22q-1.25 0-2.125-.875T3 19v-3h3V2l1.5 1.5L9 2l1.5 1.5L12 2l1.5 1.5L15 2l1.5 1.5L18 2l1.5 1.5L21 2v17q0 1.25-.875 2.125T18 22Zm12-2q.425 0 .712-.288Q19 19.425 19 19V5H8v11h9v3q0 .425.288.712.287.288.712.288ZM9 9V7h6v2Zm0 3v-2h6v2Zm8-3q-.425 0-.712-.288Q16 8.425 16 8t.288-.713Q16.575 7 17 7t.712.287Q18 7.575 18 8t-.288.712Q17.425 9 17 9Zm0 3q-.425 0-.712-.288Q16 11.425 16 11t.288-.713Q16.575 10 17 10t.712.287Q18 10.575 18 11t-.288.712Q17.425 12 17 12ZM6 20h9v-2H5v1q0 .425.287.712Q5.575 20 6 20Zm-1 0v-2 2Z"/></svg>
        </es-ribbon-button>
      </es-ribbon-section>
    `
  }
}