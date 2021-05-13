import type { ExtensionScaffoldApi, AddPanelOptions, LoadWebpackScriptOptions, Location } from '../es-api'
import { hidePanelsWithLocation, locationFromDiv } from '../utils'
import { BarController } from './BarController'
import { beginResize, endResize, getApplyFunction } from './ResizeController'

const DISPLAY_SHOW = 'flex'

class ApiImpl implements ExtensionScaffoldApi {
    private readonly locationStack = new Map<Location, AddPanelOptions[]>()
    private leftBar = new BarController('left', 'left-bar')
    private rightBar = new BarController('right', 'right-bar')

    private gridContainer?: HTMLElement

    boot(gridContainer: HTMLElement | null) {
        if (!gridContainer) {
            throw new Error('Missing gridContainer')
        }
        this.gridContainer = gridContainer
        this.gridContainer.classList.add('grid-container')
    }

    loadExtension(url: string): Promise<void> {
        return import(url).then((module) => this.activateExtension(module, url))
    }

    addPanel(options: AddPanelOptions) {
        if (document.getElementById(options.id)) {
            return Promise.reject(new Error(`Already exists ${options.id}`))
        }
        const gridContainer = this.gridContainer
        if (!gridContainer) {
            throw new Error('Missing call to boot')
        }
        hidePanelsWithLocation(options.location)

        const { outerPanel, extPanel } = this.addShadowDomPanel(gridContainer, options)

        this.styleWidthOrHeight(outerPanel, options.location, options.initialWidthOrHeight)

        if (options.iframeSource) {
            extPanel.style.position = 'absolute'
            extPanel.style.top = '0px'
            extPanel.style.bottom = '0px'
            extPanel.style.left = '0px'
            extPanel.style.right = '0px'

            const iframe = document.createElement('iframe')
            iframe.src = options.iframeSource
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            iframe.style.border = 'none'

            extPanel.appendChild(iframe)
        }

        this.pushLocation(options.location, options)
        this.updateBars(options.location)
        return Promise.resolve(extPanel)
    }

    removePanel(id: string): boolean {
        return this.withPanel(id, (parent, div) => {
            div.remove()
            const location = locationFromDiv(parent)
            this.popLocation(location, id)
            const stack = this.locationStack.get(location)
            if (!stack) {
                console.error('Class name list changed since there is no location stack', location)
                return
            }
            if (stack.length === 0) {
                // We remove them all
                return
            }
            const nextDiv = document.getElementById(stack[0].id)
            if (!nextDiv) {
                console.error('Panel missing', stack[0])
                return
            }
            nextDiv.style.display = 'block'
        })
    }

    hidePanel(id: string) {
        return this.withPanel(id, (parent, _) => {
            parent.style.display = 'none'
        })
    }
    showPanel(id: string) {
        return this.withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    hidePanelsWithLocation(location)
                    break;
            }
            div.style.display = 'block'
            parent.style.display = DISPLAY_SHOW
        })
    }

    maximizePanel(id: string) {
        this.withPanel(id, (parent, div) => {
            parent.style.position = 'absolute'
            parent.style.top = '0px'
            parent.style.bottom = '0px'
            parent.style.left = '0px'
            parent.style.right = '0px'
            parent.style.zIndex = '10'
        })
    }

    restorePanel(id: string) {
        this.withPanel(id, (parent, div) => {
            parent.style.position = ''
            parent.style.top = ''
            parent.style.bottom = ''
            parent.style.left = ''
            parent.style.right = ''
            parent.style.zIndex = ''
        })
    }

    loadWebpackScript({ url, library }: LoadWebpackScriptOptions) {
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

    private activateExtension(module: any, url: string) {
        console.debug('Activating', url)
        if (module.activate) {
            module.activate(extensionScaffold, url)
        }
    }

    private getOrCreateOuterPanel(gridContainer: HTMLElement, options: AddPanelOptions): HTMLDivElement {
        let r = gridContainer.querySelector(`.${options.location}`)
        if (r) {
            return r as HTMLDivElement
        }

        r = document.createElement('div')
        if (options.resizeHandle) {
            const dragDiv = document.createElement("div")
            dragDiv.className = `drag drag-for-${options.location}`
            r.appendChild(dragDiv)
            dragDiv.onpointerdown = e => beginResize(dragDiv, e, getApplyFunction(options.location))
            dragDiv.onpointerup = e => endResize(dragDiv, e)
        }

        return r as HTMLDivElement
    }
    private addShadowDomPanel(gridContainer: HTMLElement, options: AddPanelOptions) {
        const outerPanel = this.getOrCreateOuterPanel(gridContainer, options)

        outerPanel.style.display = DISPLAY_SHOW
        // outerPanel.id = options.id
        // Note: the classList order matters see locationFromDiv
        outerPanel.classList.add('grid-panel')
        outerPanel.classList.add(options.location)

        const shadowDiv = document.createElement('div')
        shadowDiv.id = options.id
        shadowDiv.className = 'shadow-div'
        shadowDiv.attachShadow({ mode: 'open' })
        const shadow = shadowDiv.shadowRoot
        if (!shadow) {
            throw new Error('Shadow root did not attach')
        }

        const extPanel = document.createElement('div')

        gridContainer.appendChild(outerPanel)
        outerPanel.appendChild(shadowDiv)
        shadow.appendChild(extPanel)

        return {
            outerPanel,
            extPanel
        }
    }

    private pushLocation(location: Location, options: AddPanelOptions) {
        const stack = this.locationStack.get(location) ?? []
        this.locationStack.set(location, [options, ...stack]) // needed for first time
    }
    private popLocation(location: Location, id: string) {
        const stack = this.locationStack.get(location) ?? []
        this.locationStack.set(location, stack.filter(opt => opt.id !== id)) // needed for first time
    }
    private panelsAtLocation(location: Location) {
        return this.locationStack.get(location) ?? []
    }

    private updateBars(location: Location) {
        switch (location) {
            case 'left':
                this.leftBar.updatePanel(this.panelsAtLocation(location))
                break;
            case 'right':
                this.rightBar.updatePanel(this.panelsAtLocation(location))
                break;
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

    private withPanel(id: string, f: (parent: HTMLDivElement, div: HTMLDivElement) => void) {
        const div = document.getElementById(id) as HTMLDivElement
        if (!div) {
            console.warn('Panel id not found', id)
            return false
        }
        const parent = div.parentElement
        if (!(parent instanceof HTMLDivElement)) {
            return false
        }

        f(parent, div)
        return true
    }
}

export const extensionScaffold = new ApiImpl()
