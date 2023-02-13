import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@moesol/es-runtime/build/es-api'
import { EsKbarRoute } from './kbar-route'

const BLOCKED_KEY = 'es-kbar-blocked-extensions'

export class EsBlockedExtensions extends Tonic {
  submit(e: Event) {
    e.preventDefault()

    const form: HTMLFormElement | null = e.target as any
    const textarea = form?.querySelector('textarea')
    if (textarea?.value) {
      localStorage.setItem(BLOCKED_KEY, textarea?.value)
      window.location.reload() // force use of new application configuration
    }
    
    EsKbarRoute.fromEvent(e)?.doClose()
  }
  render() {
    const c = extensionScaffold.getContext()
    const blocked = localStorage.getItem(BLOCKED_KEY) || '[ ]'
    return this.html`<es-popup-textarea value="${blocked}">
      <div>
        <input name="submit" type="submit"/>
      </div>
    </es-popup-textarea>`
  }
}
