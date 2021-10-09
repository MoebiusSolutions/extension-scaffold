import Tonic from '@optoolco/tonic'
import { extensionScaffold, Location } from '@gots/es-runtime/build/es-api'
import type { EsKbarRoute } from './kbar-route'

export class EsAddExtension extends Tonic {
  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  // e.g. "http://localhost:5000/build/ext-svelte-rollup.js",
  submit(e: Event) {
    e.preventDefault()
    const url = this.getTextInput()!.value
    console.log('adding', url)
    extensionScaffold.loadExtensions([ url ])
    
    this.getRoute()?.doClose()
  }
  connected() {
    this.getTextInput()?.focus()
  }

  styles() {
    return {
        open: {
          display: 'block',
          padding: '8px',
          position: 'fixed',
          top: '4em',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--es-theme-text-primary-on-background)',
          background: 'var(--es-theme-surface)',
          minWidth: '20em',
        },
        input: {
          flexGrow: 1,
          width: '20em',
          paddingTop: '6px',
          paddingBottom: '6px',
          background: 'transparent',
          border: 'solid 2px var(--es-theme-text-primary-on-background)',
          color: 'var(--es-theme-text-primary-on-background)',
          caretColor: 'white',
        }
    }
  }
  render() {
    return this.html`<form styles="open">
      <label>Add Extension:
        <input id="es-add-extension-input" styles="input" value="http://localhost:5000/build/ext-svelte-rollup.js">
      </label>
    </form>`
  }
}
