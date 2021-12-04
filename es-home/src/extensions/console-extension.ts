import Tonic from '@optoolco/tonic'
import { extensionScaffold, ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'

const HELP_CONSOLE_DISPLAY = 'help.console.display'

interface LogRecord {
  level: string
  args: any[]
}
interface LogRecords {
  records: LogRecord[]
}
const LOGS: LogRecords = {
  records: []
}
const MAX_LOGS = 100

class EsDebugConsole extends Tonic {
  stylesheet() {
    return `
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
        const e = new CustomEvent('console-close')
        this.dispatchEvent(e)
      }
    }
  }
  connected() {
    const c: HTMLDivElement | null = this.querySelector('.console')
    c?.addEventListener('blur', (evt: FocusEvent) => {
      const e = new CustomEvent('console-close')
      this.dispatchEvent(e)
    })
    c?.focus()
  }
  render() {
    const icons = {
      warn: this.html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
      error: this.html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      debug: this.html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"></svg>`,
      info: this.html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`,
      log: this.html`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"></svg>`,

    }
    const lines = LOGS.records.map(r => {
      const m = r.args.join(', ')
      const i: keyof typeof icons = r.level as any
      return this.html`<pre class="${r.level}">${icons[i]}${m}</pre>`
    })
    return this.html`
      <div class="container">
        <div class="header">
          <div class="close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </div>
        </div>
        <div class="console" tabindex="0">
          ${lines}
        </div>
      </div>
    `
  }
}

class EsDebugConsoleRibbonPanel extends Tonic {
  private debugConsole: EsDebugConsole | null = null
  private wasOpen = false

  async doOpen() {
    const div = await extensionScaffold.chrome.panels.addPanel({
      id: HELP_CONSOLE_DISPLAY,
      location: 'portal-wide',
    })
    const debugConsole = document.createElement('es-debug-console')
    debugConsole.addEventListener('console-close', () => {
      this.doClose()
    })
    div.appendChild(debugConsole as Node)
    
    this.debugConsole = debugConsole as any
  }
  doClose() {
    extensionScaffold.chrome.panels.removePanel(HELP_CONSOLE_DISPLAY)
    this.debugConsole = null
  }

  pointerdown(e: PointerEvent) {
    this.wasOpen = this.debugConsole !== null
  }
  click(e: MouseEvent) {
    if (e.target instanceof Element) {
      if (e.target.closest('es-ribbon-button[name="Console"]')) {
        if (!this.wasOpen) {
          this.doOpen()
        }
      } else if (e.target.closest('es-ribbon-button[data-name="Crash"]')) {
        throw new Error('Not handled')
      } else if (e.target.closest('es-ribbon-button[data-name="Bad Fetch"]')) {
        fetch('http://hastings-foundation.org')
      } else if (e.target.closest('es-ribbon-button[data-name="Clear"]')) {
        LOGS.records = []
        this.logPush('log', ['Console cleared.'])
      }
    }
  }
  logPush(level: string, args: any[]) {
    LOGS.records.push({ level, args })
    while (LOGS.records.length > MAX_LOGS) {
      LOGS.records.shift()
    }
    this.debugConsole?.reRender()
  }
  connected() {
    try {
      const levels = ['debug', 'info', 'log', 'warn', 'error']
      const self = this
      levels.forEach(level => {
        const origFn: any = console[level as keyof Console]
        function newFn(...args: any) { 
          origFn.apply(console, args)
          self.logPush(level, args.map(toString))
        }
        console[level as keyof Console] = newFn as any
      })
      function toString(a: any) {
        if (a instanceof Error) {
          return a.stack ?? a
        }
        return a
      }
      window.addEventListener('error', (evt: ErrorEvent) => {
        this.logPush('error', [toString(evt.error)])
      })
      window.addEventListener('unhandledrejection', (evt: PromiseRejectionEvent) => {
        this.logPush('error', ['Unhandled promise rejection', toString(evt.reason)])
      })
    } catch (e) {
      console.error('Failed to hook console functions')
    }
  }
  styles() {
    return {
      left: {
        textAlign: 'left',
        fontSize: '12px',
      }
    }
  }
  render() {
    this.style.display = 'flex'
    return this.html`
      <es-ribbon-section name="Debug">
        <es-ribbon-button name="Console">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5zm8.41 11.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/></svg>
        </es-ribbon-button>
        <div style="display: flex; flex-direction: column;">
          <es-ribbon-button styles="left" data-name="Crash">    <div>Crash</div>    </es-ribbon-button>
          <es-ribbon-button styles="left" data-name="Bad Fetch"><div>Bad Fetch</div></es-ribbon-button>
          <es-ribbon-button styles="left" data-name="Clear">    <div>Clear</div>    </es-ribbon-button>
      </div>
      </es-ribbon-section>
    `
  }
}

//
// Collects console output and unhandled errors into a ring buffer
//
export async function activate(scaffold: ExtensionScaffoldApi) {
  Tonic.add(EsDebugConsole)
  Tonic.add(EsDebugConsoleRibbonPanel)

  const div = scaffold.chrome.ribbonBar.claimRibbonPanel('help.console')
  if (!div) { return }
  
  const s = document.createElement('es-debug-console-ribbon-panel')
  div.innerText = ''
  div.appendChild(s)
}
