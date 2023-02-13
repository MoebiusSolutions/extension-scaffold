import Tonic from '@optoolco/tonic'
import type { EsKbarResults } from './kbar-results'
import { EsKbarRoute } from './kbar-route'

export class EsKbar extends Tonic {
  getKbarInput() : HTMLInputElement | null {
    return document.getElementById('es-kbar-input') as HTMLInputElement
  }
  getKbarResults(): EsKbarResults | null {
    return document.getElementById('es-kbar-results') as any
  }
  static handleFocusOut(e: FocusEvent) {
    // If some other element on this popup is getting focus stay here
    const related: HTMLElement | null = e.relatedTarget as any
    if (related?.closest('es-kbar')) {
      return
    }
    EsKbarRoute.fromEvent(e)?.doBlurClose()
  }

  connected() {
    this.getKbarInput()?.focus()
    this.addEventListener('focusout', EsKbar.handleFocusOut)
  }
  disconnect() {
    this.removeEventListener('focusout', EsKbar.handleFocusOut)
  }
  input(e: InputEvent) {
      const el: HTMLInputElement = e.target as any
      this.state.value = el.value
      this.getKbarResults()?.reRender()
  }
  keydown(e: KeyboardEvent) {
    this.getKbarResults()?.handleKeydown(e)
  }
  submit(e: SubmitEvent) {
    e.preventDefault()
    this.getKbarResults()?.doSubmit()
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
          filter: {
            flexGrow: 1,
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
    return this.html`<form styles="open" tabindex="0">
      <div style="display: flex; padding-top: 8px; padding-bottom: 8px;">
        <input id="es-kbar-input" autocomplete="off" styles="filter" type="text">
      </div>
      <es-kbar-results id="es-kbar-results"></es-kbar-results>
    </form>`
  }
}
