import Tonic from '@optoolco/tonic'
import type { EsKbarRoute } from './kbar-route'

export class EsPopup extends Tonic {
  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }
  private getTextArea() : HTMLInputElement | null {
    return document.getElementById("es-text-area") as HTMLInputElement
  }
  handleInputBlur(e: FocusEvent) {
    this.getRoute()?.doClose()
  }

  connected() {
    this.getTextArea()!.focus()
    this.getTextArea()?.addEventListener('blur', e => this.handleInputBlur(e))
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
    return this.html`<div styles="open">
      <textarea styles="area" id="es-text-area" class="es-popup" readonly>${this.props.message}
      </textarea>
    </div>`
  }
}
