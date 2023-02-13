import Tonic from '@optoolco/tonic'
import { extensionScaffold, Location, LOCATIONS } from '@moesol/es-runtime/build/es-api'

function panelIDs() {
  const ids: string[] = []
  LOCATIONS.forEach(l => {
    extensionScaffold.chrome.panels.panelIds(l)?.map(p => p.id).forEach(pid => {
      ids.push(pid)
    })
  })
  return ids
}

export function datalistPanelIDs<T extends Tonic>(t: T) {
  const options = panelIDs().map(pid => {
    return t.html`<option>${pid}</option>`
  })
  return t.html`
  <datalist id="es-panel-ids">
    ${options}
  </datalist>
  `
}

export class EsShowPanelList extends Tonic {
  panelIds(location: Location) {
    return extensionScaffold.chrome.panels.panelIds(location)?.map(p => p.id)
  }
  render() {
    const p = {
      center: this.panelIds('center'),
      left: this.panelIds('left'),
      right: this.panelIds('right'),
      top: this.panelIds('top'),
      bottom: this.panelIds('bottom'),
      header: this.panelIds('header'),
      footer: this.panelIds('footer'),
      'top-bar': this.panelIds('top-bar'),
      'bottom-bar': this.panelIds('bottom-bar'),
    }
    const text = JSON.stringify(p, null, "  ")
    return this.html`<es-popup-textarea value="${text}"></es-popup-textarea>`
  }
}
