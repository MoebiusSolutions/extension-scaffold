import type { ExtensionScaffoldApi, ClaimPanelOptions } from '../../../es-api/es-api'

const DISPLAY_SHOW = 'flex'

export function loadExtension(url: string) {
    import(url).then(activateExtension)
    .catch(e => console.error('Error loading extension', url, e))
}

class ApiImpl implements ExtensionScaffoldApi {
    private readonly locationStack = new Map<string, string[]>()

    ping() {

    }
    claimPanel(options: ClaimPanelOptions) {
        if (document.getElementById(options.id)) {
            return Promise.reject(new Error(`Already exists ${options.id}`))
        }
        const gridContainer = document.getElementById('grid-container')
        if (!gridContainer) {
            throw new Error('Missing #grid-container')
        }
        this.hidePanelsWithLocation(options.location)

        const outerPanel = document.createElement('div')
        outerPanel.style.display = DISPLAY_SHOW
        outerPanel.id = options.id
        outerPanel.classList.add('grid-panel')
        outerPanel.classList.add(options.location)

        const shadowDiv = document.createElement('div')
        shadowDiv.className = 'shadow-div'
        shadowDiv.attachShadow({ mode: 'open'})
        const shadow = shadowDiv.shadowRoot
        if (!shadow) {
          throw new Error('Shadow root did not attach')
        }

        const extPanel = document.createElement('div')

        gridContainer.appendChild(outerPanel)
        outerPanel.appendChild(shadowDiv)
        shadow.appendChild(extPanel)

        this.styleWidthOrHeight(outerPanel, options.location, options.initialWidthOrHeight)

        // if (options.resizeHandle) {
        //     const dragDiv = document.createElement("div")
        //     dragDiv.setAttribute('class', 'drag-for-left')
        //     outerPanel.appendChild(dragDiv)
        // }

        this.pushLocation(options.id, options.location)
        return Promise.resolve(extPanel)
    }

    releasePanel(id: string): boolean {
        return this.withPanel(id, div => {
            div.remove()
            const location = div.classList[1]
            this.popLocation(id, location)
            const stack = this.locationStack.get(location)
            if (!stack) {
                console.error('Class name list changed since there is no location stack', location)
                return
            }
            if (stack.length === 0) {
                // We remove them all
                return
            }
            const nextDiv = document.getElementById(stack[0])
            if (!nextDiv) {
                console.error('Panel missing', stack[0])
                return
            }
            nextDiv.style.display = DISPLAY_SHOW
        })
    }

    hidePanel(id: string) {
        return this.withPanel(id, div => div.style.display = 'none')
    }
    showPanel(id: string) {
        return this.withPanel(id, div => div.style.display = DISPLAY_SHOW)
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

    private pushLocation(id: string, location: string) {
        const stack = this.locationStack.get(location) ?? []
        this.locationStack.set(location, [id, ...stack]) // needed for first time
    }
    private popLocation(id: string, location: string) {
        const stack = this.locationStack.get(location) ?? []
        this.locationStack.set(location, stack.filter(i => i !== id)) // needed for first time
    }

    private hidePanelsWithLocation(location: string) {
        for (const el of document.getElementsByClassName(location)) {
            if (el instanceof HTMLDivElement) {
                el.style.display = 'none'
            }
        }
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
        const div = document.getElementById(id) as HTMLDivElement
        if (!div) {
            console.warn('Panel id not found', id)
            return false
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
