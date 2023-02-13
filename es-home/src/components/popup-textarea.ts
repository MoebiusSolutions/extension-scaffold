import Tonic from '@optoolco/tonic'
import { EsKbarRoute } from './kbar-route'

export class EsPopupTextarea extends Tonic {
  private getTextArea() : HTMLInputElement | null {
    return document.getElementById("es-text-area") as HTMLInputElement
  }
  static handleFocusOut(e: FocusEvent) {
    // If some other element on this popup is getting focus stay here
    const related: HTMLElement | null = e.relatedTarget as any
    if (related?.closest('es-popup-textarea')) {
      return
    }
    EsKbarRoute.fromEvent(e)?.doBlurClose()
  }

  connected() {
    this.getTextArea()?.focus()
    this.getTextArea()?.select()
    this.addEventListener('focusout', EsPopupTextarea.handleFocusOut)
  }
  disconnected() {
    this.removeEventListener('focusout', EsPopupTextarea.handleFocusOut)
  }
  static stylesheet() {
    return `
    textarea#es-text-area:focus {
      outline: 1px solid black;
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
        area: {
          background: 'transparent',
          color: 'var(--es-theme-text-primary-on-background)',
          width: '40em',
          height: '20em',
        }
    }
  }
  render() {
    const readonly = this.props.readonly !== undefined ? 'readonly' : ''
    return this.html`<form styles="open" tabindex="0">
      <textarea styles="area" id="es-text-area" class="es-popup" ${readonly}>${this.props.value}</textarea>
      ${this.children}
    </form>`
  }
}
