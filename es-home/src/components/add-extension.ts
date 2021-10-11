import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@gots/es-runtime/build/es-api'
import { EsKbarRoute } from './kbar-route'

export class EsAddExtension extends Tonic {
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  /* event handlers */

  // e.g. "http://localhost:5000/build/ext-svelte-rollup.js",
  submit(e: Event) {
    e.preventDefault()
    const url = this.getTextInput()!.value
    extensionScaffold.loadExtensions([ url ])
    
    EsKbarRoute.fromEvent(e)?.doClose()
  }
  render() {
    return this.html`<es-prompt label="Add Extension:" value="http://localhost:5000/build/ext-svelte-rollup.js"></es-prompt>`
  }
}
