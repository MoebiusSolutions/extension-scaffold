import type { ExtensionScaffoldApi, AddPanelOptions, LoadWebpackScriptOptions } from '../../../es-api/es-api'
import { beginResize, endResize, getApplyFunction } from './ResizeController'

const DISPLAY_SHOW = 'flex'

export function loadExtension(url: string) {
    import(url)
        .then(activateExtension)
        .catch(e => console.error('Error loading extension', url, e))
}


class ApiImpl implements ExtensionScaffoldApi {
    private readonly locationStack = new Map<string, string[]>()

    ping() {

    }
    addPanel(options: AddPanelOptions) {
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

        if (options.resizeHandle) {
            const dragDiv = document.createElement("div")
            dragDiv.className = `drag drag-for-${options.location}`
            outerPanel.appendChild(dragDiv)
            dragDiv.onpointerdown = e => beginResize(dragDiv, e, getApplyFunction(options.location))
            dragDiv.onpointerup = e => endResize(dragDiv, e)
        }

        this.pushLocation(options.id, options.location)
        return Promise.resolve(extPanel)
    }

    removePanel(id: string): boolean {
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

    loadWebpackScript({url, library}: LoadWebpackScriptOptions) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = true
            script.src = url
            script.onload = (_evt) => {
                const loadedLibrary = window[library as keyof Window] as any
                if (loadedLibrary && loadedLibrary.activate) {
                    loadedLibrary.activate(this)
                    resolve(loadedLibrary)
                } else {
                    reject(new Error('Extension missing activate function'))
                }
            }
            script.onerror = reject
            document.head.appendChild(script)
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

    private styleWidthOrHeight(div: HTMLDivElement, location: string, initialWidthOrHeight?: string) {
        switch (location) {
            case 'left':
            case 'right':
            case 'left-bar':
            case 'right-bar':
                div.style.width = initialWidthOrHeight ?? '20em'
                break;
            case 'top':
            case 'bottom':
                div.style.height = initialWidthOrHeight ?? '10em'
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
    // Plan - expose an API from the npm module - loadExtensions(exts: string[])
    // For dev testing, hard coding examples

    loadExtension('http://localhost:9091/dist/ext-react-snowpack.js')
    loadExtension('http://localhost:9092/ext-react-rollup.js')
    loadExtension('http://localhost:5000/build/ext-svelte-rollup.js')
    loadExtension('http://localhost:9093/ext-react-webpack.js')
    loadExtension('http://localhost:9094/dist/ext-lit-element.js')
}
