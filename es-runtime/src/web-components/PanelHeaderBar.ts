import { extensionScaffold } from "../controllers/ExtensionController";
import type { AddPanelOptions } from "../es-api";

export class PanelHeaderBar extends HTMLElement {
    private _panelOptions? : AddPanelOptions

    constructor() {
        super()
    }
    set panelOptions(p: AddPanelOptions) {
        this._panelOptions = p
    }

    // "light" DOM changes cannot occur in constructor
    connectedCallback() {
        const openInNew = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>`
        const closeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>`
        const expandDownSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
        </svg>`
        const expandUpSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="24px" >
          <path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
        </svg>`

        if (this._panelOptions?.popOutButton) {
            this.addButton(btn => {
                btn.innerHTML = openInNew
                btn.title = 'Pop Out'
                btn.onclick = e => this.popOutLocation(e)
            })
        }
        if (this._panelOptions?.expandButton) {
            this.addButton(btn => {
                btn.innerHTML = expandDownSvg
                btn.title = 'Restore'
                btn.className = 'restore'
                btn.onclick = e => this.restoreLocation(e)
            })
            this.addButton(btn => {
                btn.innerHTML = expandUpSvg
                btn.title = 'Expand'
                btn.className = 'expand'
                btn.onclick = e => this.expandLocation(e)
            })
        }
        if (this._panelOptions?.hideButton) {
            this.addButton(btn => {
                btn.innerHTML = closeIcon
                btn.title = 'Hide'
                btn.onclick = e => this.hideLocation(e)
            })
        }
    }

    private addButton(init: (btn: HTMLButtonElement) => void) {
        const btn = document.createElement('button')
        init(btn)
        this.appendChild(btn)
    }

    private findActiveIdFromEvent(e: MouseEvent) {
        const div = e.target as HTMLDivElement
        const active = div.closest('.grid-panel')?.querySelectorAll('.shadow-div.active')
        if (!active || !active.length) {
            console.warn('Issue finding active panel to popOut', e)
            return []
        }
        if (active.length != 1) {
            console.warn('Too many active panels to popOut', e)
            return []
        }
        if (!active.item(0).id) {
            console.warn('Active panel is missing id attribute', e)
            return []
        }
        return [active.item(0).id]
    }
    private popOutLocation(e: MouseEvent) {
        this.findActiveIdFromEvent(e).forEach(panelId => {
            extensionScaffold.chrome.panels.popOutPanel(panelId)
        })
    }
    private hideLocation(e: MouseEvent) {
        this.findActiveIdFromEvent(e).forEach(panelId => {
            extensionScaffold.chrome.panels.hidePanel(panelId)
        })
    }
    private expandLocation(e: MouseEvent) {
        this.findActiveIdFromEvent(e).forEach(panelId => {
            extensionScaffold.chrome.panels.expandPanel(panelId)
        })
    }
    private restoreLocation(e: MouseEvent) {
        this.findActiveIdFromEvent(e).forEach(panelId => {
            extensionScaffold.chrome.panels.restorePanel(panelId)
        })
    }
}
window.customElements.define('es-panel-header-bar', PanelHeaderBar)
