
import type {
    ExtensionScaffoldApi, AddPanelOptions, LoadWebpackScriptOptions,
    Location, GridState, Chrome, Fulfilled, Rejected
} from '../es-api'
import {
    hidePanelsWithLocation, locationFromDiv, restorePanelsWithLocation,
    applyGridState, getGridState, withPanel
} from '../utils'

import { BarController } from './BarController'
import { PanelsImpl } from './PanelsImpl'
import { beginResize, endResize, getApplyFunction } from './ResizeController'
import EventEmitter from 'events'

const DISPLAY_FLEX = 'flex'

class ChromeImpl implements Chrome {
    readonly panels = new PanelsImpl()
}

class ApiImpl implements ExtensionScaffoldApi {

    private readonly locationStack = new Map<Location, AddPanelOptions[]>()
    private leftBar = new BarController('left', 'left-bar')
    private rightBar = new BarController('right', 'right-bar')

    private gridContainer?: HTMLElement

    readonly chrome = new ChromeImpl()
    readonly events = new EventEmitter()

    boot(gridContainer: HTMLElement | null) {
        if (!gridContainer) {
            throw new Error('Missing gridContainer')
        }
        this.gridContainer = gridContainer
        this.gridContainer.classList.add('grid-container')
    }

    loadExtension(url: string): Promise<any> {
        return import(url).then(module => this.activateExtension(module, url))
    }

    loadExtensions(urls: string[], gridstate?: GridState): Promise<(Fulfilled | Rejected)[]> {
        function fulfilled<T>(value: T) {
            return {
                status: 'fulfilled' as const,
                value,
            }
        }
        function rejected<E>(reason: E) {
            return {
                status: 'rejected' as const,
                reason,
            }
        }
        function applyGridState<T>(value: T) {
            if (gridstate) {
                applyGridState(gridstate)
            }
            return value
        }
        const promises = urls.map(url => this.loadExtension(url))
        const mappedPromises = promises.map(promise => promise.then(fulfilled).catch(rejected))
        return Promise.all(mappedPromises).then(applyGridState)
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
        } else {
            extPanel.style.width = '100%'
            extPanel.style.height = '100%'
        }

        this.pushLocation(options.location, options)
        this.updateBars(options.location)
        return Promise.resolve(extPanel)
    }

    removePanel(id: string): boolean {
        this.restorePanel(id)

        return withPanel(id, (parent, div) => {
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
            this.updateBars(location)
        })
    }

    hidePanel(id: string) {
        if (this.chrome.panels.isPoppedOut(id)) {
            this.chrome.panels.popInPanel(id)
        }

        return withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    parent.style.display = 'none'
                    this.updateBars(location)
                    //gridstate[location].activeId = null
                    break;

                case 'center':
                    div.style.display = 'none'
                    break;
            }
            this.events.emit('grid-changed', getGridState())
        })
    }

    showPanel(id: string) {
        if (this.chrome.panels.isPoppedOut(id)) {
            this.chrome.panels.focusPopOut(id)
            return true
        }
        restorePanelsWithLocation('center') // In case it was maximized

        return withPanel(id, (parent, div) => {

            const location = locationFromDiv(parent)
            hidePanelsWithLocation(location)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    parent.style.display = DISPLAY_FLEX
                    div.style.display = 'block'
                    this.updateBars(location)
                    break;

                case 'center':
                    div.style.display = 'block'
                    break;
            }
            this.events.emit('grid-changed', getGridState())
        })
    }


    togglePanel(id: string) {
        if (this.chrome.panels.isPoppedOut(id)) {
            this.chrome.panels.popInPanel(id)
            return true
        }

        return withPanel(id, (parent, div) => {
            if (parent.style.display !== 'none' && div.style.display !== 'none') {
                this.hidePanel(id)
            } else {
                this.showPanel(id)
            }
        })
    }

    maximizePanel(id: string) {
        withPanel(id, (parent, div) => {
            parent.classList.add('grid-maximized')
            this.updateBars('left')
            this.updateBars('right')
        })
    }

    restorePanel(id: string) {
        withPanel(id, (parent, div) => {
            parent.classList.remove('grid-maximized')
            this.updateBars('left')
            this.updateBars('right')
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
        gridContainer.appendChild(r)

        return r as HTMLDivElement
    }

    private addShadowDomPanel(gridContainer: HTMLElement, options: AddPanelOptions) {
        const outerPanel = this.getOrCreateOuterPanel(gridContainer, options)

        outerPanel.style.display = DISPLAY_FLEX
        outerPanel.classList.add('grid-panel')
        outerPanel.classList.add(options.location) // Other code searches for this class name

        const shadowDiv = document.createElement('div')
        shadowDiv.id = options.id
        shadowDiv.className = 'shadow-div'
        shadowDiv.attachShadow({ mode: 'open' })
        const shadow = shadowDiv.shadowRoot
        if (!shadow) {
            throw new Error('Shadow root did not attach')
        }

        const extPanel = document.createElement('div')

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
}

export const extensionScaffold = new ApiImpl()