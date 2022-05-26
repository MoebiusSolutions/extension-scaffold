import { extensionScaffold } from "../controllers/ExtensionController";
import type { AddPanelOptions, Panels } from "../es-api";
import { defaultedOptions } from "../models/DefaultOptions";

export class PanelHeaderBar extends HTMLElement {
    private _panelOptions? : AddPanelOptions

    constructor() {
        super()
    }
    set panelOptions(options: AddPanelOptions) {
        this._panelOptions = defaultedOptions(options)
        this.render()
    }

    // "light" DOM changes cannot occur in constructor
    connectedCallback() {
        this.render()

        const panelDiv = this.parentElement
        if (!panelDiv) {
            return
        }

        this.onpointerdown = (e: PointerEvent) => {
            if (!panelDiv.classList.contains('modal') &&
                !panelDiv.classList.contains('modeless')
            ) {
                return
            }
            if (e.button !== 0 || e.target != this) {
                return
            }
            const rect = panelDiv.getBoundingClientRect()
            const startX = e.clientX
            const startY = e.clientY
            const maxRight = Math.max(0, window.innerWidth - rect.width)
            const maxBottom = Math.max(0, window.innerHeight - rect.height)

            this.onpointermove = (e: PointerEvent) => {
                const newX = rect.x + (e.clientX - startX)
                const newY = rect.y + (e.clientY - startY)

                const left = newX < 0 ? 0 : newX > maxRight ? maxRight : newX
                const top = newY < 0 ? 0 : newY > maxBottom ? maxBottom : newY

                panelDiv.style.setProperty('--left', `${left}px`)
                panelDiv.style.setProperty('--top', `${top}px`)
            }
            this.setPointerCapture(e.pointerId)
        }
        this.onpointerup = (e: PointerEvent) => {
            this.onpointermove = null
            this.releasePointerCapture(e.pointerId)
        }
    }
    private render() {
        if (!this.isConnected) {
            return
        }

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
        const alignBottom = `
        <svg height="24px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/>
        </svg>
        `

        this.innerHTML = ''
        if (this._panelOptions?.popOutButton) {
            this.addButton(openInNew, 'Pop Out', '', e => this.applyClick(e, (panels, panelId) =>
                panels.popOutPanel(panelId)
            ))
        }
        if (this._panelOptions?.expandButton) {
            this.addButton(expandDownSvg, 'Restore', 'restore', e => this.applyClick(e, 
                (panels, panelId) => panels.restorePanel(panelId)
            ))
            this.addButton(expandUpSvg, 'Expand', 'expand', e => this.applyClick(e,
                (panels, panelId) => panels.expandPanel(panelId)
            ))
        }
        if (this._panelOptions?.hideButton) {
            this.addButton(alignBottom, 'Hide', 'hide', e => this.applyClick(e,
                (panels, panelId) => panels.hidePanel(panelId)))
        }
        if (this._panelOptions?.removeButton) {
            this.addButton(closeIcon, 'Remove', 'remove', e => this.applyClick(e,
                (panels, id) => panels.removePanel(id)))
        }
    }

    private addButton(icon: string, title: string, className: string, onclick: (evt: MouseEvent) => void) {
        const btn = document.createElement('button')
        btn.innerHTML = icon
        btn.title = title
        btn.className = className
        btn.onclick = onclick
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
    private applyClick(e: MouseEvent, fn: (panels: Panels, panelId: string) => void) {
        this.findActiveIdFromEvent(e).forEach(panelId => {
            fn(extensionScaffold.chrome.panels, panelId)
        })
    }
}
window.customElements.define('es-panel-header-bar', PanelHeaderBar)
