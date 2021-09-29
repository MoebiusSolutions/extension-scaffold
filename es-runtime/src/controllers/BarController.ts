import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { isActive } from '../utils'

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

        while (divBar.lastElementChild) {
            divBar.lastElementChild.remove()
        }

        divBar.style.background = 'var(--es-theme-surface)'
        divBar.style.height = '100%'

        const styleElement = document.createElement('style')
        styleElement.setAttribute('type', 'text/css')
        styleElement.textContent = `
        .es-bar {
            background: rgba(255, 255, 255, 0.05);
        }
        .es-bar-button {
            background: transparent;
            border: none;
            color: var(--es-theme-text-secondary-on-background);
            cursor: pointer;
            padding: 14px;
            width: 58px;
            height: 58px;
        }
        .es-bar-button:hover {
            background: rgba(0, 0, 0, 0.2);
        }
        .es-bar-button.active {
            color: var(--es-theme-text-primary-on-background);
            border-left: 2px solid var(--es-theme-text-primary-on-background);
            padding-left: 12px;
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
            if (panelOptions.icon) {
                btn.appendChild(panelOptions.icon)
            } else {
                btn.innerText = `B${idx}`
            }
            btn.onclick = () => {
                extensionScaffold.chrome.panels.togglePanel(panelOptions.id)
            }
            flexContainer.appendChild(btn)
        })
    }
}