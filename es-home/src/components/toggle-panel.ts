import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@moesol/es-runtime/build/es-api'
import type { EsKbarRoute } from './kbar-route'
import { datalistPanelIDs } from './show-panel-list'

export class EsTogglePanel extends Tonic {
  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  submit(e: Event) {
    e.preventDefault()

    const id = this.getTextInput()!.value
    extensionScaffold.chrome.panels.togglePanel(id)
    
    this.getRoute()?.doClose()
  }
  render() {
    return this.html`
      <es-prompt list="es-panel-ids" label="Toggle Panel:" placeholder="id"></es-prompt>
      ${datalistPanelIDs(this)}
    `
  }
}
