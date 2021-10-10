import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@gots/es-runtime/build/es-api'
import type { EsKbarRoute } from './kbar-route'

export class EsRemovePanel extends Tonic {
  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  submit(e: Event) {
    e.preventDefault()

    const id = this.getTextInput()!.value
    extensionScaffold.chrome.panels.removePanel(id)
    
    this.getRoute()?.doClose()
  }
  render() {
    return this.html`<es-prompt label="Remove Panel:" placeholder="id"></es-prompt>`
  }
}
