import { LocationStack } from '../models/LocationStack'
import type {
    ExtensionIds, Location, AddPanelOptions,
    Panels, OrigSize
} from "../es-api";
import { extensionScaffold } from "./ExtensionController";
import { BarController } from './BarController'
import {
    hidePanelsWithLocation, showPanelsWithLocation,
    locationFromDiv, isActive, setActive, toStorage,
    fromStorage, getGridState, withPanel, copyStyles
} from '../utils'
import { beginResize, endResize, getApplyFunction } from './ResizeController'
import { TabController } from './TabController';

const DISPLAY_FLEX = 'flex'

function getDivSize(div: HTMLElement | null): OrigSize {
    const origSize: OrigSize = { size: '', location: '' }
    if (div === null) { return origSize }

    const resizable: Location[] = [ 'left', 'right', 'top', 'bottom','bottom-bar' ]
    resizable.filter(l => div.classList.contains(l)).forEach(l => {
        const size = div.style.getPropertyValue('--size')
        if (size === '100px') {
            origSize.size = fromStorage(`${l}-panel-size`) as string || '101px'
        }
        else {
            origSize.size = size
        }
        origSize.location = l
    })
    return origSize
}

function defaultResizeHandle(options: AddPanelOptions) {
    return defaultSomeOptions(options.location, options.resizeHandle)
}
function defaultPopOutButton(options: AddPanelOptions) {
    return defaultSomeOptions(options.location, options.popOutButton)
}
function defaultShowHide(options: AddPanelOptions) {
    return defaultSomeOptions(options.location, options.hideButton)
}
function defaultExpandButton(options: AddPanelOptions) {
    return defaultSomeOptions(options.location, options.expandButton)
}
// Some panels have a resize handle, pop out by default
function defaultSomeOptions(location: Location, setting?: boolean) {
    if (setting === undefined) {
        const defaultTrue = [ 'left', 'right', 'top', 'bottom']
        return defaultTrue.findIndex(s => s === location) >= 0
    }
    return setting
}

interface BeforeAddPanelEvent {
    options: AddPanelOptions
    response: AddPanelOptions | null | undefined
}


export class PanelsImpl implements Panels {
    private readonly externalWindows = new Map<string, Window>()
    private readonly locationStack = new LocationStack()
    private leftBar = new BarController('left', 'left-bar')
    private rightBar = new BarController('right', 'right-bar')
    private bottomTabs = new TabController('bottom')
    private bottomBarTabs = new TabController('bottom-bar')

    gridContainer: HTMLElement | undefined

    panelIds(location: Location) {
        return this.locationStack.get(location)
    }
    addPanel(options: AddPanelOptions) {
        if (document.getElementById(options.id)) {
            return Promise.reject(new Error(`Already exists ${options.id}`))
        }
        const gridContainer = this.gridContainer
        if (!gridContainer) {
            throw new Error('Missing call to boot')
        }

        if (options.iframeSource && options.hidden) {
            const iframe = document.createElement('iframe')
            iframe.src = options.iframeSource
            iframe.style.display = 'none'
            gridContainer.appendChild(iframe)
            return Promise.resolve(gridContainer as HTMLDivElement)
        }    

        const event: BeforeAddPanelEvent = {
            options,
            response: undefined
        }
        extensionScaffold.events.emit('before-add-panel', event)
        if (event.response === null) {
            // handler does not want to add this panel
            const fakeDiv = document.createElement('div')
            return Promise.resolve(fakeDiv)
        }
        if (event.response) {
            options = event.response
        }
        hidePanelsWithLocation(options.location)

        const { outerPanel, shadowDiv, extPanel } = this.addShadowDomPanel(gridContainer, options)
        outerPanel.style.display = DISPLAY_FLEX
        if (options.title) {
            shadowDiv.title = options.title
        }
        shadowDiv.parentElement?.classList.remove('hidden')
        setActive(shadowDiv)

        // We cannot use our CSS here because `extPanel` is in the shadow
        if (options.iframeSource) {
            const iframe = document.createElement('iframe')
            iframe.src = options.iframeSource
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            iframe.style.border = 'none'
            extPanel.appendChild(iframe) // iframe gets contentWindow during this call

            extensionScaffold.events.emit('add-iframe', iframe)
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
        // Restore any maximized center
        document.querySelectorAll('.grid-maximized .shadow-div.active').forEach(el => {
            this.restorePanel(el.id)
        })
        return withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            hidePanelsWithLocation(location)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'bottom':
                case 'bottom-bar':
                    parent.style.display = DISPLAY_FLEX
                    parent.classList.remove('hidden')
                    setActive(div)
                    showPanelsWithLocation(`above-${location}`)
                    this.updateBars(location)
                    break

                case 'center':
                    setActive(div)
                    break
            }
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
                case 'bottom-bar':
                case 'top':
                    parent.classList.add('hidden')
                    parent.classList.remove('grid-expanded')
                    hidePanelsWithLocation(`above-${location}`)
                    this.updateBars(location)
                    break

                case 'center':
                    div.style.display = 'none'
                    break
            }
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
            if (!parent.classList.contains('hidden') && isActive(div)) {
                this.hidePanel(id)
            } else {
                const orig = getDivSize(parent)
                if (['left', 'right', 'top', 'bottom', 'bottom-bar'].findIndex(l => orig.location === l) >= 0) {
                    parent.style.setProperty('--size', orig.size)
                }
                this.showPanel(id)
            }
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    maximizePanel(id: string) {
        withPanel(id, (parent, div) => {
            parent.classList.add('specific')
            parent.classList.add('grid-maximized')
            this.updateBars('left')
            this.updateBars('right')
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    restorePanel(id: string) {
        withPanel(id, (parent, div) => {
            parent.classList.remove('specific')
            parent.classList.remove('grid-maximized')
            parent.classList.remove('grid-expanded')
            this.updateBars('left')
            this.updateBars('right')
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    expandPanel(id: string) {
        withPanel(id, (parent, div) => {
            parent.classList.add('grid-expanded')
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    removePanel(id: string): boolean {
        this.restorePanel(id)

        return withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            const stack = this.locationStack.get(location)
            if (!stack) {
                console.error('Class name list changed since there is no location stack', location)
                return
            }
            if (stack.length === 1) {
                // We are about to remove the last panel in this location
                this.hidePanel(id)
            }

            div.remove()
            const nextId = this.locationStack.popLocation(location, id)

            const nextDiv = document.getElementById(nextId)
            if (!nextDiv) {
                // stack is empty
                this.updateBars(location)
                this.removeResizeHandle(location)
                return
            }
            extensionScaffold.chrome.panels.showPanel(nextId)
            this.updateBars(location)
            extensionScaffold.events.emit('grid-changed', getGridState())
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
                extensionScaffold.chrome.panels.showPanel(id)
                window.removeEventListener('beforeunload', handleBeforeUnload)
            })
            // If the parent window closes, close the children
            window.addEventListener('beforeunload', handleBeforeUnload)
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    popInPanel(id: string) {
        const externalWindow = this.externalWindows.get(id)
        if (!externalWindow) {
            console.log('No window found')
            return false
        }
        externalWindow.close()
        extensionScaffold.chrome.panels.showPanel(id)
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

    trackExtensions(ids: ExtensionIds) {
        toStorage('track-ext-shown-change', ids)
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
            const baseUrl = document.createElement('base')
            baseUrl.setAttribute('href', window.location.href)
            popOutContainer.appendChild(baseUrl)
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
            case 'bottom':
                this.bottomTabs.updatePanel(this.locationStack.panelsAtLocation(location))
                break;
            case 'bottom-bar':
                this.bottomBarTabs.updatePanel(this.locationStack.panelsAtLocation(location))
                break;
        }
    }

    private styleWidthOrHeight(div: HTMLDivElement, location: string, initialWidthOrHeight?: string) {
        switch (location) {
            case 'left':
            case 'right':
            case 'left-bar':
            case 'right-bar':
                div.style.setProperty('--size', initialWidthOrHeight ?? '20em')
                break;
            case 'top':
            case 'bottom':
            case 'bottom-bar':
                div.style.setProperty('--size', initialWidthOrHeight ?? '10em')
                break;
        }
    }

    private getOrCreateOuterPanel(gridContainer: HTMLElement, options: AddPanelOptions): {
        outerPanel: HTMLDivElement
        created: boolean
    } {
        const resizeHandle = defaultResizeHandle(options)
        const popOutButton = defaultPopOutButton(options)
        const hideButton = defaultShowHide(options)
        const expandButton = defaultExpandButton(options)

        let r = gridContainer.querySelector(`.${options.location}`)
        if (r) {
            if (resizeHandle && r.querySelectorAll('.drag').length === 0) {
                r.appendChild(this.makeResizeHandle(options))
            }
            return {
                outerPanel: r as HTMLDivElement,
                created: false
            }
            
        }

        r = document.createElement('div')
        if (resizeHandle) {
            r.appendChild(this.makeResizeHandle(options))
        }
        if (popOutButton || hideButton) {
            r.appendChild(this.makePanelHeaderBar({
                ...options,
                popOutButton,
                hideButton,
                expandButton,
            }))
        }
        gridContainer.appendChild(r)

        return {
            outerPanel: r as HTMLDivElement,
            created: true
        }
    }

    private makeResizeHandle(options: AddPanelOptions) {
        const dragDiv = document.createElement('div')
        dragDiv.className = `drag drag-for-${options.location}`
        dragDiv.onpointerdown = e => beginResize(dragDiv, e, getApplyFunction(options.location))
        dragDiv.onpointerup = e => endResize(dragDiv, e)
        return dragDiv
    }
    private makePanelHeaderBar(options: AddPanelOptions) {
        const panelHeaderBar = document.createElement('es-panel-header-bar')
        panelHeaderBar.className = `panel-header-bar ${options.location}`
        const p: any = panelHeaderBar
        p.panelOptions = options
        return panelHeaderBar
    }

    private removeResizeHandle(location: Location) {
        const dragDiv = document.querySelector(`.drag.drag-for-${location}`)
        if (dragDiv) {
            dragDiv.remove()
        }
    }

    private addShadowDomPanel(gridContainer: HTMLElement, options: AddPanelOptions) {
        const { outerPanel, created } = this.getOrCreateOuterPanel(gridContainer, options)

        // the options.location className is used in querySelector searches
        outerPanel.classList.add('grid-panel', options.location)

        const { shadowDiv, extPanel } = this.makeShadowDomDivs(outerPanel)
        shadowDiv.id = options.id
        shadowDiv.className = options.location.startsWith('portal') ? 'shadow-portal' : 'shadow-div'

        if (created) {
            this.styleWidthOrHeight(outerPanel, options.location, options.initialWidthOrHeight)
        }

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
