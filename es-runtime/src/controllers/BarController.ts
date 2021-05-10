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

    private addPanel(panelOptions: AddPanelOptions[]) {
        extensionScaffold.addPanel({
            id: `es.runtime.${this.barLocation}`,
            location: this.barLocation,
            initialWidthOrHeight: '40px',
            resizeHandle: false
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

        panelOptions.forEach((panelOptions, idx) => {
            const btn = document.createElement('button')
            btn.className = 'es-bar-button'
            btn.title = panelOptions.title ?? ''
            btn.innerText = `B${idx}`
            btn.onclick = () => {
                console.log('btn clicked', panelOptions)
                extensionScaffold.showPanel(panelOptions.id)
            }
            divBar.appendChild(btn)
        })
    }
}