import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { isActive } from '../utils'
import type { PanelHeaderBar } from '../web-components/PanelHeaderBar'

const expandClass = 'grid-expanded'

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
    appendPanelHeaderBar(tabBar: HTMLDivElement, panelOptions: AddPanelOptions) {
        tabBar.appendChild(this.makePanelHeaderBar({
            ...panelOptions,
            expandButton: true,
            hideButton: true,
        }))
    }

    private makePanelHeaderBar(options: AddPanelOptions) {
        const panelHeaderBar = document.createElement('es-panel-header-bar')
        panelHeaderBar.className = `panel-header-bar ${options.location}`
        panelHeaderBar.style.order = '1000'
        panelHeaderBar.style.flexGrow = '1'
        const p: any = panelHeaderBar
        p.panelOptions = options
        return panelHeaderBar
    }

    updatePanelHeader(panelOptions: AddPanelOptions[]) {
        const panelHeader: PanelHeaderBar | null = document.querySelector(`.grid-panel.${this.tabLocation} es-panel-header-bar`)
        if (!panelHeader) { return }
        document.querySelectorAll(`.grid-panel.${this.tabLocation} .active`).forEach(active => {
            const options = panelOptions.find(opt => opt.id === active.id)
            if (!options) { return }
            panelHeader.panelOptions = options
        })
    }
    
    updatePanel(panelOptions: AddPanelOptions[]) {
        let tabBar = this.tabBar
        if (!tabBar) {
            tabBar = this.addTabDiv()
        }

        this.render(tabBar, panelOptions)
        this.updatePanelHeader(panelOptions)
    }
    render(tabBar: HTMLDivElement, panelOptions: AddPanelOptions[]) {
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

            const orderEvent = {
                options: panelOptions,
                order: ''
            }
            extensionScaffold.events.emit('order-panel-button', orderEvent)
            btn.style.order = orderEvent.order

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
        if (panelOptions[0]) {
            this.appendPanelHeaderBar(tabBar, panelOptions[0])
        }
    }
}