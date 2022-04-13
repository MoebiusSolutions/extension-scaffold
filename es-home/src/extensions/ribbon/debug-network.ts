import Tonic from '@optoolco/tonic'

interface NetworkActivity {
  url: string
  status: number
}
interface NetworkRecords {
  records: NetworkActivity[]
}
export const NET_LOGS: NetworkRecords = {
  records: [{
    url: 'http://example.com/good',
    status: 200
  },
  {
    url: 'http://example.com/foo/bar',
    status: 404
  }]
}
export const MAX_LOGS = 100

export class EsDebugNetwork extends Tonic {
  private consoleLines: Tonic | null = null

  stylesheet() {
    return /*css*/`
    .header {
      background: var(--es-theme-surface);
      position: absolute;
      right: 8px;
    }
    .close {
      background: rgba(255,255,255,0.03);
      fill: var(--es-theme-text-secondary-on-background);
      display: flex;
      justify-content: end;
      padding: 4px;
      cursor: pointer;
    }
    .close:hover {
      fill: var(--es-theme-text-primary-on-background);
      background: rgba(0, 0, 0, 0.3);
    }
    .close svg {
      width: 16px;
      height: 16px;
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
  click(e: MouseEvent) {
    if (e.target instanceof Element) {
      if (e.target.closest('.close')) {
        const e = new CustomEvent('network-close')
        this.dispatchEvent(e)
      }
    }
  }
  connected() {
    const c: HTMLDivElement | null = this.querySelector('.console')
    c?.addEventListener('blur', (evt: FocusEvent) => {
      const e = new CustomEvent('network-close')
      this.dispatchEvent(e)
    })
    c?.focus()

    this.consoleLines = this.querySelector('es-network-lines')
  }
  renderLinesOnly() {
    this.consoleLines?.reRender()
  }
  render() {
    return this.html/*html*/`
      <div class="container">
        <div class="header">
          <div class="close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
        </div>
        <div class="console" tabindex="0">
          <es-network-lines></es-network-lines>
        </div>
      </div>
    `
  }
}
