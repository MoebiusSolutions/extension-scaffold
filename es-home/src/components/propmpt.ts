import Tonic from '@optoolco/tonic'
import { extensionScaffold, Location } from '@gots/es-runtime/build/es-api'
import type { EsKbarRoute } from './kbar-route'

export class EsPrompt extends Tonic {
  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  handleInputBlur(e: FocusEvent) {
    this.getRoute()?.doClose()
  }

  /* event handlers */

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
    this.getTextInput()?.addEventListener('blur', e => this.handleInputBlur(e))
  }

  static stylesheet() {
    return `
    #es-add-extension-input {
      flex-grow: 1;
      min-width: 20em;
      border: solid 1px rgba(255,255,255,0.3);
      color: var(--es-theme-text-primary-on-background);
      caret-color: var(--es-theme-text-primary-on-background);
      padding: 6px;
      background: transparent;
    }
    #es-add-extension-input:focus {
      outline: none;
    }
    `
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
    }
  }
  render() {
    return this.html`<form styles="open">
      <label for="es-add-extension-input">${this.props.label}</label>
      <input id="es-add-extension-input" placeholder="${this.props.placeholder}" value="${this.props.value}">
    </form>`
  }
}
