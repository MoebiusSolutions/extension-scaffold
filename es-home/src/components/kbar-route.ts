import Tonic from '@optoolco/tonic'

function handleKeyDown(event: KeyboardEvent) {
  const r: EsKbarRoute | null = document.getElementById('es-kbar-route') as any
  r?.handleKeyDown(event)
}

export function addKeydownForIFrame(iframe: HTMLIFrameElement) {
  if (!iframe.contentDocument) {
      // If the frame never loads we still want its keydown events, so keep trying until is resolves
      setTimeout(() => addKeydownForIFrame(iframe), 100)
  }
  iframe.addEventListener('DOMContentLoaded', () => addKeydownForIFrame(iframe))

  // If the contents loads later, add keydown
  iframe.contentDocument?.addEventListener('keydown', handleKeyDown)
}

export class EsKbarRoute extends Tonic {
  static fromEvent(e: Event) : EsKbarRoute | null {
    const target = e.target as HTMLElement | null
    return target?.closest('es-kbar-route') as EsKbarRoute
  }
  handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k" && !event.repeat) {
      event.preventDefault()
      if (this.state.name === 'kbar') {
        this.doClose()
      } else {
        this.doOpen('kbar')
      }
    } else if (event.key === 'Escape') {
      this.doClose()
    }
  }
  doOpen(name: string) {
    this.state.name = name
    this.reRender()
  }
  doClose() {
    this.state.name = undefined
    this.reRender()
  }
  doBlurClose() {
    // Allow debug sessions to globally disable auto close on focusout
    //   window.kbar = { noBlurClose: true }
    const w: any = window
    if (w.kbar?.noBlurClose) { return }

    this.doClose()
  }

  connected() {
      window.addEventListener('keydown', handleKeyDown, {
        capture: true
      })
  }
  disconnected() {
    window.removeEventListener('keydown', handleKeyDown, {
      capture: true
    })
  }
  render() {
    switch (this.state.name) {
      case 'kbar':
        return this.html`<es-kbar id="es-kbar"></es-kbar>`

      case 'add-extension':
        return this.html`<es-add-extension id="es-add-extension"></es-add-extension>`

      case 'load-application':
        return this.html`<es-load-application></es-load-application>`

      case 'blocked-extensions':
        return this.html`<es-blocked-extensions></es-blocked-extensions>`
  
      case 'show-panel-list':
        return this.html`<es-show-panel-list id="es-show-context"></es-show-panel-list>`

      case 'toggle-panel':
        return this.html`<es-toggle-panel></es-toggle-panel>`
  
      case 'remove-panel':
        return this.html`<es-remove-panel></es-remove-panel>`

      case 'show-context':
        return this.html`<es-show-context id="es-show-context"></es-show-context>`

      case undefined:
        return undefined

      default:
        console.log('unknown route id', this.state.name)
        return undefined
    }
  }
}
