import type { ExtensionScaffoldApi, AddPanelOptions, LoadWebpackScriptOptions, Location, Panels, Chrome } from '../es-api'
import { LocationStack } from '../models/LocationStack'
import { hidePanelsWithLocation, locationFromDiv, withPanel, withGrid } from '../utils'
import { BarController } from './BarController'
import { PanelsImpl } from './PanelsImpl'
import { beginResize, endResize, getApplyFunction } from './ResizeController'

const DISPLAY_FLEX = 'flex'

class ChromeImpl implements Chrome {
    readonly panels = new PanelsImpl()
}

class ApiImpl implements ExtensionScaffoldApi {
    private readonly locationStack = new LocationStack()
    private leftBar = new BarController('left', 'left-bar')
    private rightBar = new BarController('right', 'right-bar')

    private gridContainer?: HTMLElement

    readonly chrome = new ChromeImpl()

    boot(gridContainer: HTMLElement | null) {
        if (!gridContainer) {
            throw new Error('Missing gridContainer')
        }
        this.gridContainer = gridContainer
        this.gridContainer.classList.add('grid-container')

        const gridPortal = document.createElement('div')
        gridPortal.classList.add('grid-portal')
        this.gridContainer.append(gridPortal)
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
        outerPanel.style.display = DISPLAY_FLEX
        this.styleWidthOrHeight(outerPanel, options.location, options.initialWidthOrHeight)

        // We cannot use our CSS here because `extPanel` is in the shadow
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

        this.locationStack.pushLocation(options.location, options)
        this.updateBars(options.location)
        return Promise.resolve(extPanel)
    }

    removePanel(id: string): boolean {
        this.restorePanel(id)

        return withPanel(id, (parent, div) => {
            div.remove()
            const location = locationFromDiv(parent)
            this.locationStack.popLocation(location, id)
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
                    withGrid(`above-${location}`, div => div.style.display = 'none')
                    parent.style.display = 'none'
                    this.updateBars(location)
                    break;

                case 'center':
                    div.style.display = 'none'
                    break;
            }
        })
    }
    showPanel(id: string) {
        if (this.chrome.panels.isPoppedOut(id)) {
            this.chrome.panels.focusPopOut(id)
            return true
        }
        // Restore any maximized grid
        document.querySelectorAll('.grid-maximized').forEach(el => el.classList.remove('grid-maximized'))

        return withPanel(id, (parent, div) => {

            const location = locationFromDiv(parent)
            hidePanelsWithLocation(location)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    parent.style.display = DISPLAY_FLEX
                    withGrid(`above-${location}`, div => div.style.display = 'block')
                    div.style.display = 'block'
                    this.updateBars(location)
                    break;

                case 'center':
                    div.style.display = 'block'
                    break;
            }
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

    private activateExtension(module: any, url: string) {
        console.debug('Activating', url)
        if (module.activate) {
            module.activate(extensionScaffold, url)
        }
    }

    private getOrCreateOuterPanel(gridContainer: HTMLElement, options: AddPanelOptions): HTMLDivElement {
        let r = gridContainer.querySelector(`.${options.location}`)
        if (r) {
            if (options.resizeHandle && r.querySelectorAll('.drag').length === 0) {
                r.appendChild(this.makeResizeHandle(options))
            }
            return r as HTMLDivElement
        }

        r = document.createElement('div')
        if (options.resizeHandle) {
            r.appendChild(this.makeResizeHandle(options))
        }
        gridContainer.appendChild(r)

        return r as HTMLDivElement
    }
    private makeResizeHandle(options: AddPanelOptions) {
        const dragDiv = document.createElement('div')
        dragDiv.className = `drag drag-for-${options.location}`
        dragDiv.onpointerdown = e => beginResize(dragDiv, e, getApplyFunction(options.location))
        dragDiv.onpointerup = e => endResize(dragDiv, e)
        return dragDiv
    }
    private addShadowDomPanel(gridContainer: HTMLElement, options: AddPanelOptions) {
        const outerPanel = this.getOrCreateOuterPanel(gridContainer, options)

        outerPanel.classList.add('grid-panel')
        outerPanel.classList.add(options.location) // Other code searches for this class name

        const { shadowDiv, extPanel } = this.makeShadowDomDivs(outerPanel)
        shadowDiv.id = options.id
        shadowDiv.className = 'shadow-div'

        return {
            outerPanel,
            shadowDiv,
            extPanel,
        }
    }

    /**
     * Creates a tree of `div` elements:
     * `outerPanel` -> `shadowDiv` -> `shadowRoot` -> `extPanel`
     * 
     * @param outerPanel 
     * @returns 
     */

    private makeShadowDomDivs(outerPanel: HTMLDivElement) {
        const shadowDiv = document.createElement('div')
        shadowDiv.attachShadow({ mode: 'open'})
        const shadowRoot = shadowDiv.shadowRoot
        if (!shadowRoot) {
          throw new Error('Shadow root did not attach')
        }
        const extPanel = document.createElement('div')

        outerPanel.appendChild(shadowDiv)
        shadowRoot.appendChild(extPanel)

        return {
            shadowDiv, extPanel
        }
    }

    private updateBars(location: Location) {
        switch (location) {
            case 'left':
                this.leftBar.updatePanel(this.locationStack.panelsAtLocation(location))
                break;
            case 'right':
                this.rightBar.updatePanel(this.locationStack.panelsAtLocation(location))
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
