import Tonic from '@optoolco/tonic'
import { extensionScaffold, Location } from '@moesol/es-runtime/build/es-api'
import { EsKbarRoute } from './kbar-route'

export class EsPrompt extends Tonic {
  private getTextInput() : HTMLInputElement | null {
    return document.getElementById("es-add-extension-input") as HTMLInputElement
  }

  static handleFocusOut(e: FocusEvent) {
    EsKbarRoute.fromEvent(e)?.doBlurClose()
  }

  // e.g. "http://localhost:5000/build/ext-svelte-rollup.js",
  submit(e: Event) {
    e.preventDefault()
    const url = this.getTextInput()!.value
    console.log('adding', url)
    extensionScaffold.loadExtensions([ url ])

    EsKbarRoute.fromEvent(e)?.doClose()
  }
  connected() {
    this.getTextInput()?.focus()
    this.getTextInput()?.select()
    this.addEventListener('focusout', EsPrompt.handleFocusOut)
  }
  disconnected() {
    this.removeEventListener('focusout', EsPrompt.handleFocusOut)
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
    const list = this.props.list ? `list=${this.props.list}` : ''
    return this.html`<form styles="open">
      <label for="es-add-extension-input">${this.props.label}</label>
      <input ${list} id="es-add-extension-input" placeholder="${this.props.placeholder}" value="${this.props.value}" />
    </form>`
  }
}
