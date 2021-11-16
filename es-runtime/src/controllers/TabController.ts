import { AddPanelOptions, extensionScaffold, Location } from '../es-api'
import { isActive } from '../utils'

const maximizedClass = 'grid-expanded'

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

        const maximize = document.createElement('button')
        this.syncMaximizeButton(grid, maximize)
        maximize.onclick = () => {
            if (grid.classList.contains(maximizedClass)) {
                grid.classList.remove(maximizedClass)
                this.syncMaximizeButton(grid, maximize)
            } else {
                grid.classList.add(maximizedClass)
                this.syncMaximizeButton(grid, maximize)
            }
        }
        tabBar.appendChild(maximize)
    }
    syncMaximizeButton(grid: Element, maximize: HTMLButtonElement) {
        const expandDownSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
          </svg>`
        const expandUpSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="24px" >
          <path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
        </svg>`

        const isMaximized = grid.classList.contains(maximizedClass)
        if (isMaximized) {
            maximize.innerHTML = expandDownSvg
            maximize.title = 'Restore Panel'
    
        } else {
            maximize.innerHTML = expandUpSvg
            maximize.title = 'Expand Panel'
        }
        maximize.className = 'es-tab-bar-button'
        maximize.style.float = 'right'

        if (grid.classList.contains('hidden')) {
            maximize.style.display = 'none'
        } else {
            maximize.style.display = ''
        }
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
        this.appendExpandButton(tabBar)
    }
}