import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@gots/es-runtime/build/es-api'
import { EsKbarRoute } from './kbar-route'

export class EsLoadApplication extends Tonic {
  submit(e: Event) {
    e.preventDefault()
    const form: HTMLFormElement | null = e.target as any
    const textarea = form?.querySelector('textarea')

    console.log('submit', textarea?.value)
    EsKbarRoute.fromEvent(e)?.doClose()
  }
  render() {
    const c = extensionScaffold.getContext()
    return this.html`<es-popup-textarea value="{ }">
      <div>
        <input name="submit" type="submit"/>
      </div>
    </es-popup-textarea>`
  }
}
