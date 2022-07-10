import Tonic from '@optoolco/tonic'
import { isNetworkDebugEnabled, storeNetworkDebugEnabled, wasActivated } from '../network-extension'

export class EsDebugNetwork extends Tonic {
  private networkLines: Tonic | null = null

  stylesheet() {
    return /*css*/`
    .field-flexbox {
      display: flex;
      justify-content: space-between;
    }
    .container {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      overflow: auto;
    }
    .console {
      background: var(--es-theme-surface);
      padding: 8px;
      overflow: auto;
      resize: vertical;
      max-height: -webkit-fill-available;
    }
    .console pre {
      margin: 4px;
      color: var(--es-theme-text-primary-on-background);
    }
    .console pre svg {
      width: 12px;
      margin-right: 2px;
      margin-left: 2px;
      vertical-align: middle;
    }
    .console pre.debug {
      border: 1px solid rgba(0,0,255,0.2);
      background: rgba(0,0,255,0.04);
    }
    .console pre.info {
      fill: var(--es-theme-text-secondary-on-background);
    }
    .console pre.warn {
      border: 1px solid rgba(255,255,0,0.2);
      background: rgba(255,255,0,0.04);
      fill: yellow;
    }
    .console pre.error {
      border: 1px solid rgba(255,0,0,0.2);
      background: rgba(255,0,0,0.04);
      fill: darkred;
    }
    `
  }
  connected() {
    const c: HTMLDivElement | null = this.querySelector('.console')
    c?.focus()

    this.networkLines = this.querySelector('es-network-lines')

    if (!('serviceWorker' in navigator)) {
      return
    }
  }
  change(evt: InputEvent) {
    const tgt = evt.target instanceof HTMLInputElement ? evt.target : null
    if (tgt?.id === 'netdbg_enabled') {
      storeNetworkDebugEnabled(tgt?.checked)
    }
  }
  renderLinesOnly() {
    this.networkLines?.reRender()
  }
  render() {
    const networkEnabledChecked = isNetworkDebugEnabled() ? 'checked' : ''
    return this.html/*html*/`
      <div class="container">
        <fieldset class="field-flexbox">
          <div>
            <input type="checkbox" id="netdbg_enabled" ${networkEnabledChecked}>
            <label for="netdbg_enabled">Debug network activity (requires refresh)</label>
          </div>
          <div>
            <label for="netdbg_activated">Debugging activated:</label>
            <span class="activated" id="netdbg_activated">${wasActivated()? 'true' : 'false'}</span>
          </div>
        </fieldset>
        <div class="console" tabindex="0">
          <es-network-lines></es-network-lines>
        </div>
      </div>
    `
  }
}
