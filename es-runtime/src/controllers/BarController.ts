import { extensionScaffold, Location } from '../es-api'
import { hidePanelsWithLocation } from '../utils'

export class BarController {
    private readonly controlLocation: Location
    private readonly barLocation: Location
    private divBar: HTMLDivElement | undefined

    constructor(controlLocation: Location, location: Location) {
        this.controlLocation = controlLocation
        this.barLocation = location
    }

    private addPanel(ids: string[]) {
        extensionScaffold.addPanel({
            id: `es.runtime.${this.barLocation}`,
            location: this.barLocation,
            initialWidthOrHeight: '40px',
            resizeHandle: false
          }).then(div => {
              this.divBar = div
              this.updatePanel(ids)
          })
    }

    updatePanel(ids: string[]) {
        const divBar = this.divBar
        if (!divBar) {
            this.addPanel(ids)
            return
        }

        while (divBar.lastElementChild) {
            divBar.lastElementChild.remove()
        }

        ids.forEach((id, idx) => {
            const btn = document.createElement('button')
            btn.className = 'es-bar-button'
            btn.innerText = `B${idx}`
            btn.onclick = () => {
                console.log('btn clicked', id)
                hidePanelsWithLocation(this.controlLocation)
                extensionScaffold.showPanel(id)
            }
            divBar.appendChild(btn)
        })
    }
}