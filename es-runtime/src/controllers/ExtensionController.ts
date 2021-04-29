import type { ExtensionScaffoldApi, ClaimPanelOptions } from '../../../es-api/es-api'

export function loadExtension(url: string) {
    import(url).then(activateExtension)
    .catch(e => console.error('Error loading extension', url, e))
}

class ApiImpl implements ExtensionScaffoldApi {
    private readonly claims = new Map<string, string>()

    ping() {

    }
    claimPanel(options: ClaimPanelOptions) {
        const outerPanel = document.getElementById(options.location) as HTMLDivElement
        if (!outerPanel) {
            throw new Error(`Unknown location ${options.location}`)
        }
        outerPanel.style.display = 'block'
        outerPanel.innerHTML = ''

        const shadowDiv = document.createElement('div')
        shadowDiv.attachShadow({ mode: 'open'})

        const extPanel = document.createElement('div')
        extPanel.style.position = 'relative'

        const shadow = shadowDiv.shadowRoot
        if (!shadow) {
          throw new Error('Shadow root did not attach')
        }

        outerPanel.appendChild(shadowDiv)
        shadow.appendChild(extPanel)

        this.styleWidthOrHeight(outerPanel, options.location, options.initialWidthOrHeight)

        // if (options.resizeHandle) {
        //     const dragDiv = document.createElement("div")
        //     dragDiv.setAttribute('class', 'drag-for-left')
        //     outerPanel.appendChild(dragDiv)
        // }

        this.claims.set(options.id, options.location)
        return Promise.resolve(extPanel)
    }

    releasePanel(id: string): boolean {
        // TODO - restore the prior panel if there was a "stacked" extension here.
        return this.withPanel(id, div => {
            div.style.display = 'none'
            div.innerHTML = ''
            this.claims.delete(id)
        })
    }

    hidePanel(id: string) {
        return this.withPanel(id, div => div.style.display = 'none')
    }
    showPanel(id: string) {
        return this.withPanel(id, div => div.style.display = 'block')
    }

    maximizePanel(id: string) {
        this.withPanel(id, div => {
            div.style.position = 'absolute'
            div.style.top = '0px'
            div.style.bottom = '0px'
            div.style.left = '0px'
            div.style.right = '0px'
            div.style.zIndex = '10'
        })
    }

    restorePanel(id: string) {
        this.withPanel(id, div => {
            div.style.position = ''
            div.style.top = ''
            div.style.bottom = ''
            div.style.left = ''
            div.style.right = ''
            div.style.zIndex = ''
        })
    }

    private styleWidthOrHeight(div: HTMLDivElement, location: string, initialWidthOrHeight = "20em") {
        switch (location) {
            case 'left':
            case 'right':
            case 'above-left':
            case 'above-right':
            case 'left-bar':
            case 'right-bar':
                div.style.width = initialWidthOrHeight
                break;
            case 'top':
            case 'bottom':
                div.style.height = initialWidthOrHeight
                break;
        }
    }

    private withPanel(id: string, f: (div: HTMLDivElement) => void) {
        const location = this.claims.get(id)
        if (!location) {
            console.warn('Claim not found', id)
            return false
        }
        const div = document.getElementById(location) as HTMLDivElement
        if (!div) {
            console.warn('Claim location not found', location)
        }
        f(div)
        return true
    }

}

const api = new ApiImpl()

function activateExtension(module: any) {
    console.log('Loaded', module)
    if (module.activate) {
        module.activate(api)
    }
}

export function loadExtensions() {
    // TODO need to design where we will host the list of extensions
    // For dev testing, hard coding an example
    loadExtension('http://localhost:9091/dist/extension-entry.js')
    loadExtension('http://localhost:9092/bundle.js')
    loadExtension('http://localhost:5000/build/bundle.js')
}
