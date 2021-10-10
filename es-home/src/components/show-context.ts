import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@gots/es-runtime/build/es-api'

export class EsShowContext extends Tonic {
  render() {
    const c = extensionScaffold.getContext()
    const msg = JSON.stringify(c, null, "  ")
    return this.html`<es-popup message="${msg}"></es-popup>`
  }
}
