import Tonic from '@optoolco/tonic'
import { extensionScaffold } from '@gots/es-runtime/build/es-api'

export class EsShowPanelList extends Tonic {
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
    const c = ['panel list todo']
    const cs = JSON.stringify(c, null, "  ")
    return this.html`<div styles="open"><pre>${cs}</pre></div>`
  }
}
