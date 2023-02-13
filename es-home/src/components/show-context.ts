import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@moesol/es-runtime/build/es-api'

export class EsShowContext extends Tonic {
  render() {
    const c = extensionScaffold.getContext()
    const text = JSON.stringify(c, null, "  ")
    return this.html`<es-popup-textarea readonly value="${text}"></es-popup-textarea>`
  }
}
