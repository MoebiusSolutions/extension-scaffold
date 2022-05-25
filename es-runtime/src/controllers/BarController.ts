import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { isActive } from '../utils'
import type { PanelHeaderBar } from '../web-components/PanelHeaderBar'

export class BarController {
    private readonly controlLocation: Location
    private readonly barLocation: Location
    private divBar: HTMLDivElement | undefined

    constructor(controlLocation: Location, location: Location) {
        this.controlLocation = controlLocation
        this.barLocation = location
    }

    private addPanel(panelOptions: AddPanelOptions[]) {
        extensionScaffold.chrome.panels.addPanel({
            id: `es.runtime.${this.barLocation}`,
            location: this.barLocation,
            resizeHandle: false,
            initialWidthOrHeight: 'inherit'
        }).then(div => {
            this.divBar = div
            this.updatePanel(panelOptions)
        })
    }

    updatePanel(panelOptions: AddPanelOptions[]) {
        const divBar = this.divBar
        if (!divBar) {
            this.addPanel(panelOptions)
            return
        }
        this.render(divBar, panelOptions) // Must be first to set `active`
        this.updatePanelHeader(panelOptions)
    }

    private updatePanelHeader(panelOptions: AddPanelOptions[]) {
        const panelHeader: PanelHeaderBar | null = document.querySelector(`.grid-panel.${this.controlLocation} es-panel-header-bar`)
        if (!panelHeader) { return }
        document.querySelectorAll(`.grid-panel.${this.controlLocation} .active`).forEach(active => {
            const options = panelOptions.find(opt => opt.id === active.id)
            if (!options) { return }
            panelHeader.panelOptions = options
        })
    }

    private render(divBar: HTMLDivElement, panelOptions: AddPanelOptions[]) {
        while (divBar.lastElementChild) {
            divBar.lastElementChild.remove()
        }

        divBar.style.background = 'var(--es-theme-surface)'
        divBar.style.height = '100%'

        const styleElement = document.createElement('style')
        styleElement.setAttribute('type', 'text/css')
        styleElement.textContent = /*css*/`
        .es-bar {
            background: rgba(255, 255, 255, 0.05);
        }
        .es-bar-button {
            background: transparent;
            border: none;
            user-select: none;
            color: var(--es-theme-text-secondary-on-background);
            cursor: pointer;
            padding-left: 6px;
            padding-right: 6px;
            padding-top: 14px;
            padding-bottom: 14px;
            min-width: 32px;
        }
        .es-bar-button:hover {
            background: rgba(0, 0, 0, 0.2);
        }
        .es-bar-button.active {
            color: var(--es-theme-text-primary-on-background);
            border-right: 2px solid var(--es-theme-text-primary-on-background);
            padding-right: 4px;
        }

        .es-bar-button .use-fill {
            fill: var(--es-theme-text-secondary-on-background);
        }
        .es-bar-button.active .use-fill {
            fill: var(--es-theme-text-primary-on-background);
        }

        .es-bar-button .use-stroke {
            stroke: var(--es-theme-text-secondary-on-background);
        }
        .es-bar-button.active .use-stroke {
            stroke: var(--es-theme-text-primary-on-background);
        }
        `
        divBar.appendChild(styleElement)

        const flexContainer = document.createElement('div')
        flexContainer.className = 'es-bar'
        flexContainer.style.height = '100%'
        flexContainer.style.display = 'flex'
        flexContainer.style.flexDirection = 'column'
        divBar.appendChild(flexContainer)

        const oneIsMaximized = document.querySelectorAll('.grid-maximized').length > 0

        panelOptions.forEach((panelOptions, idx) => {
            const btn = document.createElement('button')
            btn.className = 'es-bar-button'
            const extensionDiv = document.getElementById(panelOptions.id)
            if (extensionDiv && !oneIsMaximized) {
                if (isActive(extensionDiv) && !extensionDiv.parentElement?.classList.contains('hidden')) {
                    //const parentElement = panelDiv.parentElement
                    btn.classList.add('active')
                }
            }
            btn.title = panelOptions.title ?? ''

            const orderEvent = {
                options: panelOptions,
                order: ''
            }
            extensionScaffold.events.emit('order-panel-button', orderEvent)
            btn.style.order = orderEvent.order

            if (panelOptions.icon) {
                btn.appendChild(panelOptions.icon)
            } else {
                const div = document.createElement('span')
                div.innerText = panelOptions.title ?? `B${idx}`
                div.style.writingMode = 'tb'
                div.style.transform = 'rotate(180deg)'
                btn.appendChild(div)
            }
            btn.onclick = () => {
                extensionScaffold.chrome.panels.togglePanel(panelOptions.id)
            }
            flexContainer.appendChild(btn)
        })
    }
}