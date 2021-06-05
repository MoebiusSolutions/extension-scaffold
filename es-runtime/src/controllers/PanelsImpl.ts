import { LocationStack } from '../models/LocationStack'
import type { Location, AddPanelOptions, Panels } from "../es-api";
import { extensionScaffold } from "./ExtensionController";
import { BarController } from './BarController'
import {
    hidePanelsWithLocation, locationFromDiv,
    isActive, setActive, setInactive,
    getGridState, withPanel, withGrid, copyStyles
} from '../utils'
import { beginResize, endResize, getApplyFunction } from './ResizeController'

const DISPLAY_FLEX = 'flex'


export class PanelsImpl implements Panels {
    private readonly externalWindows = new Map<string, Window>()
    private readonly locationStack = new LocationStack()
    private leftBar = new BarController('left', 'left-bar')
    private rightBar = new BarController('right', 'right-bar')

    gridContainer: HTMLElement | undefined

    addPanel(options: AddPanelOptions) {
        if (document.getElementById(options.id)) {
            return Promise.reject(new Error(`Already exists ${options.id}`))
        }
        const gridContainer = this.gridContainer
        if (!gridContainer) {
            throw new Error('Missing call to boot')
        }
        hidePanelsWithLocation(options.location)

        const { outerPanel, shadowDiv, extPanel } = this.addShadowDomPanel(gridContainer, options)
        outerPanel.style.display = DISPLAY_FLEX
        this.styleWidthOrHeight(outerPanel, options.location, options.initialWidthOrHeight)
        if (options.title) {
            shadowDiv.title = options.title
        }

        function styleAbsolute() {
            extPanel.style.position = 'absolute'
            extPanel.style.top = '0px'
            extPanel.style.bottom = '0px'
            extPanel.style.left = '0px'
            extPanel.style.right = '0px'
        }

        // We cannot use our CSS here because `extPanel` is in the shadow
        if (options.iframeSource) {
            styleAbsolute()

            const iframe = document.createElement('iframe')
            iframe.src = options.iframeSource
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            iframe.style.border = 'none'

            extPanel.appendChild(iframe)
        } if (options.location !== 'portal') {
            extPanel.style.width = '100%'
            extPanel.style.height = '100%'
        }

        this.locationStack.pushLocation(options.location, options)
        this.updateBars(options.location)
        return Promise.resolve(extPanel)
    }

    showPanel(id: string) {
        if (this.isPanelPoppedOut(id)) {
            this.focusPopOut(id)
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
                    withGrid(`above-${location}`, div => setActive(div))
                    div.style.display = 'block'
                    this.updateBars(location)
                    break

                case 'center':
                    div.style.display = 'block'
                    break
            }
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    hidePanel(id: string) {
        if (this.isPanelPoppedOut(id)) {
            this.popInPanel(id)
        }

        return withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                    withGrid(`above-${location}`, setInactive(div))
                    parent.style.display = 'none'

                    this.updateBars(location)
                    break

                case 'center':
                    div.style.display = 'none'
                    break
            }
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    togglePanel(id: string) {
        if (this.isPanelPoppedOut(id)) {
            this.popInPanel(id)
            return true
        }

        if (document.querySelectorAll('.grid-maximized').length > 0) {
            return this.showPanel(id)
        }

        return withPanel(id, (parent, div) => {
            if (parent.style.display !== 'none' && isActive(div)) {
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

    popOutPanel(id: string) {
        return withPanel(id, (parent, div) => {
            function handleBeforeUnload() {
                extWindow.close()
            }

            extensionScaffold.chrome.panels.hidePanel(id)

            const { extWindow, popOutContainer } = this.getOrCreatePopOutWindow(id)
            extWindow.document.title = div.title

            popOutContainer.appendChild(div)

            extWindow.addEventListener('beforeunload', () => {
                parent.appendChild(div) // Move the div back
                div.style.display = 'none'
                extensionScaffold.chrome.panels.showPanel(id)
                window.removeEventListener('beforeunload', handleBeforeUnload)
            })
            // If the parent window closes, close the children
            window.addEventListener('beforeunload', handleBeforeUnload)
        })
    }

    popInPanel(id: string) {
        const externalWindow = this.externalWindows.get(id)
        if (!externalWindow) {
            console.log('No window found')
            return false
        }
        externalWindow.close()
        return true
    }

    isPanelPoppedOut(id: string): boolean {
        const extWindow = this.externalWindows.get(id)
        if (!extWindow) {
            return false
        }
        if (extWindow.closed) {
            return false
        }
        const div = extWindow.document.getElementById(id)
        if (!div) {
            return false
        }
        return true
    }

    focusPopOut(id: string) {
        const externalWindow = this.externalWindows.get(id)
        if (!externalWindow) {
            console.log('No window found')
            return false
        }
        externalWindow.focus()
    }

    private getOrCreatePopOutWindow(id: string) {
        let extWindow = this.externalWindows.get(id) ?? null
        if (extWindow && extWindow.closed === false) {
            extWindow.focus()
            const popOutContainer = extWindow.document.querySelector('.pop-out-container')
            if (!popOutContainer) {
                throw new Error('Missing <div class="pop-out-container">')
            }
            return { extWindow, popOutContainer }
        } else {
            extWindow = window.open('', id)
            if (!extWindow) {
                throw new Error('Unable to create pop out window')
            }
            copyStyles(document, extWindow.document)
            const popOutContainer = document.createElement('div')
            popOutContainer.className = 'pop-out-container'
            extWindow.document.body.appendChild(popOutContainer)

            this.externalWindows.set(id, extWindow)
            return { extWindow, popOutContainer }
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

        // the options.location className is used in querySelector searches
        outerPanel.classList.add('grid-panel', options.location)

        const { shadowDiv, extPanel } = this.makeShadowDomDivs(outerPanel)
        shadowDiv.id = options.id
        shadowDiv.className = options.location === 'portal' ? 'shadow-portal' : 'shadow-div'

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
        shadowDiv.attachShadow({ mode: 'open' })
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
}
