import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { isActive } from '../utils'

export class TabController {
    private readonly tabLocation: Location
    private tabBar: HTMLDivElement | undefined

    constructor(location: Location) {
        this.tabLocation = location
    }

    private addTabDiv(): HTMLDivElement {
        this.tabBar = document.createElement( "div" );
        this.tabBar.className = 'es-tab-bar'
        const grid = document.querySelector(`.${this.tabLocation}`)
        if (grid) {
            grid.appendChild(this.tabBar)
        }
        return this.tabBar
    }

    updatePanel(panelOptions: AddPanelOptions[]) {
        let tabBar = this.tabBar
        if (!tabBar) {
            tabBar = this.addTabDiv()
        }

        while (tabBar.lastElementChild) {
            tabBar.lastElementChild.remove()
        }

        const oneIsMaximized = document.querySelectorAll('.grid-maximized').length > 0

        panelOptions.forEach((panelOptions, idx) => {
            const btn = document.createElement('button')
            btn.className = 'es-tab-bar-button'
            const extensionDiv = document.getElementById(panelOptions.id)
            if (extensionDiv && !oneIsMaximized) {
                if (isActive(extensionDiv) && !extensionDiv.parentElement?.classList.contains('hidden')) {
                    btn.classList.add('active')
                }
            }
            btn.title = panelOptions.title ?? ''
            if (panelOptions.icon) {
                btn.appendChild(panelOptions.icon)
            } else if (panelOptions.title) {
                btn.innerText = `${panelOptions.title}`
            } else {
                btn.innerText = `B${idx}`
            }
            btn.onclick = () => {
                extensionScaffold.chrome.panels.togglePanel(panelOptions.id)
            }
            tabBar!.appendChild(btn)
        })
    }
}