import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@moesol/es-runtime/build/es-api'
import { EsKbarRoute } from './kbar-route'

export class EsLoadApplication extends Tonic {
  submit(e: Event) {
    e.preventDefault()

    const form: HTMLFormElement | null = e.target as any
    const textarea = form?.querySelector('textarea')
    if (textarea?.value) {
      localStorage.setItem('es-kbar-load-application', textarea?.value)
      window.location.reload() // force use of new application configuration
    }
    
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
