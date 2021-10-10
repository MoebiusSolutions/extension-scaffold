import Tonic from '@optoolco/tonic'
import { extensionScaffold, Location } from '@gots/es-runtime/build/es-api'

export class EsShowPanelList extends Tonic {
  panelIds(location: Location) {
    return extensionScaffold.chrome.panels.panelIds(location)?.map(p => p.id)
  }
  render() {
    const p = {
      left: this.panelIds('left'),
      right: this.panelIds('right'),
      top: this.panelIds('top'),
      bottom: this.panelIds('bottom'),
      header: this.panelIds('header'),
      footer: this.panelIds('footer'),
      'top-bar': this.panelIds('top-bar'),
      'bottom-bar': this.panelIds('bottom-bar'),
    }
    const msg = JSON.stringify(p, null, "  ")
    return this.html`<es-popup message="${msg}"></es-popup>`
  }
}
