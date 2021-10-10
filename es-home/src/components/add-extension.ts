import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@gots/es-runtime/build/es-api'
import type { EsKbarRoute } from './kbar-route'

export class EsAddExtension extends Tonic {
  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  /* event handlers */

  // e.g. "http://localhost:5000/build/ext-svelte-rollup.js",
  submit(e: Event) {
    e.preventDefault()
    const url = this.getTextInput()!.value
    extensionScaffold.loadExtensions([ url ])
    
    this.getRoute()?.doClose()
  }
  render() {
    return this.html`<es-prompt label="Add Extension:" value="http://localhost:5000/build/ext-svelte-rollup.js"></es-prompt>`
  }
}
