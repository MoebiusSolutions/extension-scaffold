import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { hidePanelsWithLocation } from '../utils'

export class BarController {
    private readonly controlLocation: Location
    private readonly barLocation: Location
    private divBar: HTMLDivElement | undefined

    constructor(controlLocation: Location, location: Location) {
        this.controlLocation = controlLocation
        this.barLocation = location
    }

    private addPanel(panelOptions: AddPanelOptions[], shown: string | null) {
        extensionScaffold.addPanel({
            id: `es.runtime.${this.barLocation}`,
            location: this.barLocation,
            resizeHandle: false,
            initialWidthOrHeight: 'inherit'
          }).then(div => {
              this.divBar = div
              this.updatePanel(panelOptions, shown)
          })
    }

    updatePanel(panelOptions: AddPanelOptions[], shown: string | null) {
        const divBar = this.divBar
        if (!divBar) {
            this.addPanel(panelOptions, shown)
            return
        }

        while (divBar.lastElementChild) {
            divBar.lastElementChild.remove()
        }

        divBar.style.background = 'black'
        divBar.style.height = '100%'

        const styleElement = document.createElement('style')
        styleElement.setAttribute('type', 'text/css')
        styleElement.textContent = `
        .es-bar {
            background: rgba(255, 255, 255, 0.3)
        }
        .es-bar-button {
            background: transparent;
            padding: 1em;
            border: none;
            color: lightgrey;
            cursor: pointer;
        }
        .es-bar-button:hover {
            background: rgba(0, 0, 0, 0.2);
            color: var(--es-theme-text-primary-on-background);
        }
        .es-bar-button.active {
            font-weight: bold;
            color: var(--es-theme-text-primary-on-background);
        }
        `
        divBar.appendChild(styleElement)

        const flexContainer = document.createElement('div')
        flexContainer.className = 'es-bar'
        flexContainer.style.height = '100%'
        flexContainer.style.display = 'flex'
        flexContainer.style.flexDirection = 'column'
        divBar.appendChild(flexContainer)

        panelOptions.forEach((panelOptions, idx) => {
            const btn = document.createElement('button')
            btn.className = 'es-bar-button'
            if (panelOptions.id === shown) {
                btn.classList.add('active')
            }
            btn.title = panelOptions.title ?? ''
            btn.innerText = `B${idx}`
            btn.onclick = () => {
                console.log('btn clicked', panelOptions)
                extensionScaffold.togglePanel(panelOptions.id)
            }
            flexContainer.appendChild(btn)
        })
    }
}