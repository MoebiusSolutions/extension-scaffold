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

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(155, 155, 155, 0.5);
      border-radius: 20px;
      border: transparent;
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
    `
  }
  render() {
    const lines = LOGS.records.map(r => r.args.join(', ')).map(l => this.html`<div>${l}</div>`)
    return this.html`
    <div class="container">
      <div class="console">${lines}</div>
    </div>
    `
  }
}

class EsDebugConsoleRibbonPanel extends Tonic {
  private open = false

  async doOpen() {
    const div = await extensionScaffold.chrome.panels.addPanel({
      id: HELP_CONSOLE_DISPLAY,
      location: 'portal-wide',
    })
    const c = document.createElement('es-debug-console')
    div.appendChild(c)
  }
  doClose() {
    extensionScaffold.chrome.panels.removePanel(HELP_CONSOLE_DISPLAY)
  }

  click(e: MouseEvent) {
    if (e.target instanceof Element) {
      if (e.target.closest('es-ribbon-button')) {
        this.open = !this.open
        if (this.open) {
          this.doOpen()
        } else {
          this.doClose()
        }
      }
    }
  }
  render() {
    return this.html`
      <es-ribbon-section name="Debug">
        <es-ribbon-button name="Console">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5zm8.41 11.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/></svg>
        </es-ribbon-button>
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

  try {
    const levels = ['debug', 'info', 'log', 'warn', 'error']
    levels.forEach(level => {
      const origFn: any = console[level as keyof Console]
      function newFn(...args: any) { 
        origFn.apply(console, args)
        LOGS.records.push({ level, args })
        while (LOGS.records.length > MAX_LOGS) {
          LOGS.records.shift()
        }
      }
      console[level as keyof Console] = newFn as any
    })
  } catch (e) {
    console.error('Failed to hook console functions')
  }
}
