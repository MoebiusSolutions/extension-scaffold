import Tonic from "@optoolco/tonic"
import { EsDebugConsole, LOGS, MAX_LOGS } from "./debug-console"
import { extensionScaffold } from '@gots/es-runtime/build/es-api'
import { publishJson } from '@gots/noowf-inter-widget-communication';

const HELP_CONSOLE_DISPLAY = 'help.console.display'

export class EsDebugConsoleRibbonPanel extends Tonic {
  private debugConsole: EsDebugConsole | null = null
  private wasOpen = false

  async doOpen() {
    const div = await extensionScaffold.chrome.panels.addPanel({
      id: HELP_CONSOLE_DISPLAY,
      location: 'modeless',
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
  private doPublish(target: Element) {
    const section = target.closest('es-ribbon-section')
    const message: HTMLInputElement = section?.querySelector('[name="message"]') as any
    publishJson('es.ping.topic', {
      message: message?.value
    })
  }

  pointerdown(e: PointerEvent) {
    this.wasOpen = this.debugConsole !== null
  }
  click(e: MouseEvent) {
    if (e.target instanceof Element) {
      const target = e.target
      if (e.target.closest('es-ribbon-button[label="Console"]')) {
        if (!this.wasOpen) {
          this.doOpen()
        }
      } else if (e.target.closest('[data-name="Crash"]')) {
        throw new Error('Not handled')
      } else if (e.target.closest('[data-name="Bad Fetch"]')) {
        fetch('http://hastings-foundation.org')
      } else if (e.target.closest('[data-name="Clear"]')) {
        LOGS.records = []
        this.logPush('log', ['Console cleared.'])
      } else if (e.target.closest('[data-name="Publish"]')) {
        this.doPublish(target)
      }
    }
  }
  logPush(level: string, args: any[]) {
    LOGS.records.push({ level, args })
    while (LOGS.records.length > MAX_LOGS) {
      LOGS.records.shift()
    }
    this.debugConsole?.renderLinesOnly()
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
    return this.html/*html*/`
      <es-ribbon-section label="Debug">
        <es-ribbon-button label="Console">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 5h10v2h2V3c0-1.1-.9-1.99-2-1.99L7 1c-1.1 0-2 .9-2 2v4h2V5zm8.41 11.59L20 12l-4.59-4.59L14 8.83 17.17 12 14 15.17l1.41 1.42zM10 15.17L6.83 12 10 8.83 8.59 7.41 4 12l4.59 4.59L10 15.17zM17 19H7v-2H5v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4h-2v2z"/></svg>
        </es-ribbon-button>
        <es-ribbon-column>
          <es-ribbon-button styles="left" data-name="Crash">    <div>Crash</div>    </es-ribbon-button>
          <es-ribbon-button styles="left" data-name="Bad Fetch"><div>Bad Fetch</div></es-ribbon-button>
          <es-ribbon-button styles="left" data-name="Clear">    <div>Clear</div>    </es-ribbon-button>
        </es-ribbon-column>
        <es-ribbon-column>
          <div>es.ping.topic</div>
          <input name="message" placeholder="message">
          <es-ribbon-button-small data-name="Publish" label="Publish"></es-ribbon-button>
        </es-ribbon-column>
      </es-ribbon-section>
    `
  }
}