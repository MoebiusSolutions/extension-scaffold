import Tonic from '@optoolco/tonic'
import type { EsAddExtension } from './add-extension'
import type { EsKbar } from './kbar'
import type { EsKbarRoute } from './kbar-route'
import { publishJson } from '@moesol/inter-widget-communication'

interface Command {
  label: string
  command?: (cmd: Command) => void
  route?: string
}
export class EsKbarResults extends Tonic {
  selectIndex: number = 0

  commands: Command[] = [
    { label: 'Show Context', route: 'show-context' },
    { label: 'Add Extension', route: 'add-extension' },
    { label: 'Load Application', route: 'load-application' },
    { label: 'Blocked Extensions', route: 'blocked-extensions' },
    { label: 'List Panels',  route: 'show-panel-list' },
    { label: 'Toggle Panel', route: 'toggle-panel' },
    { label: 'Remove Panel', route: 'remove-panel' },
    { label: 'Ping IWC', command: this.pingInterWidgetComms },
  ]

  private getRoute(): EsKbarRoute | null {
    return document.getElementById("es-kbar-route") as any
  }

  showContext() {
    this.getRoute()?.doOpen('show-context')
  }
  addExtension() {
    this.getRoute()?.doOpen('add-extension')
  }
  loadApplication() {
    this.getRoute()?.doOpen('load-application')
  }
  panelList() {
    this.getRoute()?.doOpen('show-panel-list')
  }
  togglePanel() {
    this.getRoute()?.doOpen('toggle-panel')
  }
  removePanel() {
    this.getRoute()?.doOpen('remove-panel')
  }
  pingInterWidgetComms() {
    publishJson('es.ping.topic', {
      message: 'ping',
      now: Date.now()
    })
    this.getRoute()?.doClose()
  }
  doFilter() {
    const value = this.getKbarInput()?.value
    return this.commands
      .filter(c => !value || c.label.toLowerCase().includes(value.toLowerCase()))
  }
  getKbar(): EsKbar | null {
    return document.getElementById('es-kbar') as any
  }
  getKbarInput(): HTMLInputElement | null {
    return document.getElementById('es-kbar-input') as HTMLInputElement
  }
  getAddExtension(): EsAddExtension | null {
    return document.getElementById('es-add-extension') as any
  }
  doSubmit() {
    const commands = this.doFilter()
    if (this.selectIndex < commands.length) {
      this.doCommand(commands[this.selectIndex])
    }
  }
  doCommand(cmd: Command) {
    if (cmd.command) {
      cmd.command.call(this, cmd)
    }
    if (cmd.route) {
      this.getRoute()?.doOpen(cmd.route)
    }
  }
  wrapSelectIndex() {
    if (this.selectIndex < 0) { 
      this.selectIndex = this.doFilter().length - 1
    }
    if (this.selectIndex >= this.doFilter().length) {
      this.selectIndex = 0
    }
  }

  click(e: MouseEvent) {
    const el = e.target as HTMLElement
    if (el.classList.contains('command')) {
      const c = this.commands.find(c => c.label === el.innerText)
      if (c) {
        this.doCommand(c)
      }
    }
  }
  handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      this.selectIndex++
    } else if (e.key === 'ArrowUp') {
      this.selectIndex--
    }
    this.wrapSelectIndex()
    this.reRender()
  }
  styles() {
    return {
        common: {
          cursor: 'pointer',
          padding: '8px',
        },
        selected: {
          background: 'rgba(255,255,255,0.1)',
          padding: '8px'
        },
        unselected: {
        }
    }
}
render() {
    this.wrapSelectIndex()
    const commands: any = this.doFilter().map((c, idx) => { 
      const styles = idx === this.selectIndex ? 'selected' : 'unselected'
      return this.html`<div class="command" styles="common ${styles}">${c.label}</div>`
    })
    return this.html`${commands}`
  }
}
