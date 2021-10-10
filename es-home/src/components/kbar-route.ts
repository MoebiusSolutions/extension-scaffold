import Tonic from '@optoolco/tonic'

function handleKeyDown(event: KeyboardEvent) {
  const r: EsKbarRoute | null = document.getElementById('es-kbar-route') as any
  r?.handleKeyDown(event)
}

export class EsKbarRoute extends Tonic {
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

  connected() {
      window.addEventListener('keydown', handleKeyDown)
  }
  disconnected() {
    window.removeEventListener('keydown', handleKeyDown)
  }
  render() {
    switch (this.state.name) {
      case 'kbar':
        return this.html`<es-kbar id="es-kbar"></es-kbar>`

      case 'add-extension':
        return this.html`<es-add-extension id="es-add-extension"></es-add-extension>`

      case 'show-panel-list':
        return this.html`<es-show-panel-list id="es-show-context"></es-show-panel-list>`

      case 'toggle-panel':
        return this.html`<es-toggle-panel></es-toggle-panel>`
  
      case 'remove-panel':
        return this.html`<es-remove-panel></es-remove-panel>`

      case 'show-context':
        return this.html`<es-show-context id="es-show-context"></es-show-context>`

      default:
        console.log('unknown route id', this.state.name)
        return undefined
    }
  }
}
