import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { isActive } from '../utils'

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
    appendExpandButton(tabBar: HTMLDivElement) {
        const grid = document.querySelector(`.${this.tabLocation}`)
        if (!grid) {
            return
        }

        const emptyGrow = document.createElement('div')
        emptyGrow.style.flexGrow = '1'
        emptyGrow.style.order = '1000'
        tabBar.appendChild(emptyGrow)

        const expandBtn = document.createElement('button')
        this.syncExpandButton(grid, expandBtn)
        expandBtn.onclick = () => {
            if (grid.classList.contains(expandClass)) {
                grid.classList.remove(expandClass)
                this.syncExpandButton(grid, expandBtn)
            } else {
                grid.classList.add(expandClass)
                this.syncExpandButton(grid, expandBtn)
            }
        }
        tabBar.appendChild(expandBtn)
    }
    syncExpandButton(grid: Element, expandBtn: HTMLButtonElement) {
        const expandDownSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
          </svg>`
        const expandUpSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="24px" >
          <path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
        </svg>`

        const isExpanded = grid.classList.contains(expandClass)
        if (isExpanded) {
            expandBtn.innerHTML = expandDownSvg
            expandBtn.title = 'Restore Panel'
    
        } else {
            expandBtn.innerHTML = expandUpSvg
            expandBtn.title = 'Expand Panel'
        }
        expandBtn.className = 'es-tab-bar-button'

        if (grid.classList.contains('hidden')) {
            expandBtn.style.display = 'none'
        } else {
            expandBtn.style.display = ''
        }
        expandBtn.style.order = '1000'
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
        this.appendExpandButton(tabBar)
    }
}