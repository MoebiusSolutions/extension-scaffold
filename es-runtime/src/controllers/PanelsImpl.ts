import { LocationStack } from '../models/LocationStack'
import {
    ExtensionIds, Location, AddPanelOptions,
    Panels, OrigSize, LOCATIONS, InitialWidthOrHeight
} from "../es-api";
import { extensionScaffold } from "./ExtensionController";
import { BarController } from './BarController'
import {
    hidePanelsWithLocation, showPanelsWithLocation,
    locationFromDiv, isActive, setActive, toStorage,
    fromStorage, getGridState, withPanel, copyStyles, 
    appendIwcContext, validateLocation, pushHistoryState
} from '../utils'
import { beginResize, endResize, getApplyFunction } from './ResizeController'
import { TabController } from './TabController';
import { defaultedOptions } from '../models/DefaultOptions';

const DISPLAY_FLEX = 'flex'

function getDivSize(div: HTMLElement | null): OrigSize {
    const origSize: OrigSize = { size: '', location: '' }
    if (div === null) { return origSize }

    const resizable: Location[] = [ 'left', 'right', 'top', 'top-bar', 'bottom','bottom-bar' ]
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

const isDialog = (location: Location) => location === 'modal' || location === 'modeless'

function updateModalPane() {
    const md: HTMLDivElement | null = document.querySelector('#es-modal-pane')
    if (!md) {
        console.warn('Missing #es-modal-pane')
        return
    }
    if (document.querySelectorAll('.grid-panel.modal:not(.hidden)').length !== 0) {
        md.style.display = 'block'
    } else {
        md.style.display = 'none'
        md.style.zIndex = '2' // above drag
    }
}

export function updateRaisedPanel() {
    let panelDiv = document.createElement('div')
    let maxZ = 1
    document.querySelectorAll('.grid-panel.modal, .grid-panel.modeless').forEach(el => {
        const div: HTMLDivElement = el as any
        div.classList.remove('raised')

        const divZ = div.style.zIndex ? Number(div.style.zIndex): 0
        if (maxZ < divZ) {
            maxZ = divZ
            panelDiv = div
        }
    })
    panelDiv.classList.add('raised')
}

interface BeforeAddPanelEvent {
    options: AddPanelOptions
    response: AddPanelOptions | null | undefined
}

interface BeforeRemovePanelEvent {
    id: string
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
        if (!options.hidden) {
            validateLocation(options.location)
        }

        if (options.iframeSource && options.hidden) {
            const iframe = document.createElement('iframe')
            iframe.src = appendIwcContext(options.iframeSource)
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
        if (!isDialog(options.location)) {
            hidePanelsWithLocation(options.location)
        }

        const { outerPanel, shadowDiv, extPanel } = this.addShadowDomPanel(gridContainer, options)
        outerPanel.style.display = DISPLAY_FLEX
        if (options.title) {
            shadowDiv.setAttribute('data-title', options.title)
        }
        shadowDiv.parentElement?.classList.remove('hidden')
        setActive(shadowDiv)

        // We cannot use our CSS here because `extPanel` is in the shadow
        if (options.iframeSource) {
            const iframe = document.createElement('iframe')
            iframe.src = appendIwcContext(options.iframeSource)
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            iframe.style.border = 'none'
            // without position: absolute - we get an unwanted scrollbar
            iframe.style.position = 'absolute'
            extPanel.appendChild(iframe) // iframe gets contentWindow during this call

            extensionScaffold.events.emit('add-iframe', iframe)
        } 
        if (options.location !== 'portal') {
            extPanel.style.width = '100%'
            extPanel.style.height = '100%'
        }
        
        this.locationStack.pushLocation(options.location, options)
        updateModalPane()
        updateRaisedPanel()
        this.updateBars(options.location)
        return Promise.resolve(extPanel)
    }

    showPanel(id: string, pushToHistory: boolean = true) {
        if (this.isPanelPoppedOut(id)) {
            this.focusPopOut(id)
            return true
        }
        return withPanel(id, (parent, div) => {
            const wasHidden = !isActive(div)
            const location = locationFromDiv(parent)
            if (!isDialog(location)) {
                // Restore any maximized panels
                document.querySelectorAll('.grid-maximized .shadow-div.active').forEach(el => {
                    this.restorePanel(el.id)
                })
                hidePanelsWithLocation(location)
            }
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'top-bar':
                case 'bottom':
                case 'bottom-bar':
                case 'modal':
                case 'modeless':
                    parent.style.display = DISPLAY_FLEX
                    parent.classList.remove('hidden')
                    setActive(div)
                    showPanelsWithLocation(`above-${location}`)
                    updateModalPane()
                    this.updateBars(location)
                    break

                case 'center':
                    setActive(div)
                    break
            }
            if (isDialog(location)) {
                updateRaisedPanel()
            }
            pushToHistory && wasHidden && pushHistoryState(getGridState())
        })
    }


    hidePanel(id: string, pushToHistory: boolean = true) {
        if (this.isPanelPoppedOut(id)) {
            this.popInPanel(id, false)
        }

        return withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            switch (location) {
                case 'left':
                case 'right':
                case 'top':
                case 'top-bar':
                case 'bottom':
                case 'bottom-bar':
                    this.closeLocation(location)
                    hidePanelsWithLocation(`above-${location}`)
                    updateModalPane()
                    this.updateBars(location)
                    break
                case 'modal':
                case 'modeless':
                    parent.classList.add('hidden')
                    parent.classList.remove('grid-expanded')
                    updateModalPane()
                    updateRaisedPanel()
                    break;

                case 'center':
                    div.style.display = 'none'
                    break
            }
            pushToHistory && pushHistoryState(getGridState())
        })
    }
    closeLocation(location: Location) {
        if (LOCATIONS.findIndex(l => l === location) < 0) {
            console.error('Invalid location', location)
            return
        }
        const gridDiv = document.querySelector(`.grid-panel.${location}`)
        if (!gridDiv) {
            return
        }
        gridDiv.classList.add('hidden')
        gridDiv.classList.remove('grid-expanded')
    }
    isPanelHidden(id: string): boolean {
        let result = false
        withPanel(id, (parent, div) => {
            result = parent.classList.contains('hidden')
        })
        return result
    }

    togglePanel(id: string, pushToHistory: boolean = true) {
        if (this.isPanelPoppedOut(id)) {
            this.popInPanel(id, pushToHistory)
            return true
        }

        if (document.querySelectorAll('.grid-maximized').length > 0) {
            return this.showPanel(id, pushToHistory)
        }

        return withPanel(id, (parent, div) => {
            if (!parent.classList.contains('hidden') && isActive(div)) {
                this.hidePanel(id, pushToHistory)
            } else {
                const orig = getDivSize(parent)
                if (['left', 'right', 'top', 'top-bar', 'bottom', 'bottom-bar'].findIndex(l => orig.location === l) >= 0) {
                    parent.style.setProperty('--size', orig.size)
                }
                this.showPanel(id, pushToHistory)
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
            div.style.width = 'initial';
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    restorePanel(id: string, pushToHistory: boolean = true) {
        withPanel(id, (parent, div) => {
            parent.classList.remove('specific')
            parent.classList.remove('grid-maximized')
            parent.classList.remove('grid-expanded')
            this.updateBars('left')
            this.updateBars('right')
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
        pushToHistory && pushHistoryState(getGridState())
    }

    expandPanel(id: string, pushToHistory: boolean = true) {
        withPanel(id, (parent, div) => {
            parent.classList.add('grid-expanded')
            extensionScaffold.events.emit('grid-changed', getGridState())
        })
        pushToHistory && pushHistoryState(getGridState())
    }

    removePanel(id: string): boolean {
        if (this.isPanelPoppedOut(id)) {
            this.popInPanel(id, false)
        }
        this.restorePanel(id, false)

        return withPanel(id, (parent, div) => {
            const location = locationFromDiv(parent)
            const stack = this.locationStack.get(location)
            if (!stack) {
                console.error('Class name list changed since there is no location stack', location)
                return
            }

            const beforeRemoveEvent: BeforeRemovePanelEvent = { id };
            extensionScaffold.events.emit('before-remove-panel', beforeRemoveEvent);

            if (stack.length === 1) {
                // We are about to remove the last panel in this location
                this.hidePanel(id)
            }
            div.remove()
            const nextId = this.locationStack.popLocation(location, id)

            if (isDialog(location)) {
                parent.remove()
                updateModalPane()
                updateRaisedPanel()
                return
            }

            const nextDiv = document.getElementById(nextId)
            if (nextDiv) {
                extensionScaffold.chrome.panels.showPanel(nextId)
            } else {
                // stack is empty
                this.removeResizeHandle(location)
            }
            this.updateBars(location)

            extensionScaffold.events.emit('grid-changed', getGridState())
        })
    }

    saveSize( div: HTMLDivElement) {
        const width = div.style.getPropertyValue('width')
        if (width && width.length > 0) {
            div.setAttribute('data-width',width)
        }
        const height = div.style.getPropertyValue('height')
        if (height && height.length > 0) {
            div.setAttribute('data-height',height)
        }
        div.style.setProperty('width','100%')
        div.style.setProperty('height','100%')
    }

    restoreSize( div: HTMLDivElement) {
        const width = div.getAttribute('data-width')
        if (width && width.length > 0) {
            div.style.setProperty('width', width)
        }
        else {
            div.style.removeProperty('width')
        }
        const height = div.getAttribute('data-height')
        if (height && height.length > 0) {
            div.style.setProperty('height', height)
        }
        else {
            div.style.removeProperty('height')
        }
    }

    popOutPanel(id: string) {
        return withPanel(id, (parent, div) => {
            function handleBeforeUnload() {
                extWindow.close()
            }

            this.saveSize(div)
            extensionScaffold.chrome.panels.hidePanel(id)

            const { extWindow, popOutContainer } = this.getOrCreatePopOutWindow(id)
            extWindow.document.title = div.title

            popOutContainer.appendChild(div)

            extWindow.addEventListener('beforeunload', () => {
                extensionScaffold.events.emit('panel-popped-in', extWindow)
                this.restoreSize(div)
                parent.appendChild(div) // Move the div back
                extensionScaffold.chrome.panels.showPanel(id)
                window.removeEventListener('beforeunload', handleBeforeUnload)
            })
            // If the parent window closes, close the children
            window.addEventListener('beforeunload', handleBeforeUnload)
            extensionScaffold.events.emit('grid-changed', getGridState())
            extensionScaffold.events.emit('panel-popped-out', extWindow)
        })
    }

    popInPanel(id: string, pushToHistory: boolean = true) {
        const externalWindow = this.externalWindows.get(id)
        if (!externalWindow) {
            console.log('No window found')
            return false
        }
        externalWindow.close()
        extensionScaffold.chrome.panels.showPanel(id, pushToHistory)
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

    private styleWidthOrHeight(
        div: HTMLDivElement, shadowDiv: HTMLDivElement,
        location: string, initialWidthOrHeight?: InitialWidthOrHeight
    ) {
        const size = (i: InitialWidthOrHeight | undefined, dimension: 'width' | 'height') => {
            if (!i) {
                return i
            }
            if (typeof i === 'string') {
                return i
            }
            return i[dimension]
        }
        switch (location) {
            case 'left':
            case 'right':
            case 'left-bar':
            case 'right-bar':
                div.style.setProperty('--size', size(initialWidthOrHeight, 'width') ?? '30em')
                break;
            case 'top':
            case 'top-bar':
            case 'bottom':
            case 'bottom-bar':
                div.style.setProperty('--size', size(initialWidthOrHeight, 'height') ?? '10em')
                break;
            case 'modal':
            case 'modeless':
                shadowDiv.style.width = size(initialWidthOrHeight, 'width') ?? ''
                shadowDiv.style.height = size(initialWidthOrHeight, 'height') ?? ''
                break;
        }
    }

    private getOrCreateOuterPanel(gridContainer: HTMLElement, options: AddPanelOptions): {
        outerPanel: HTMLDivElement
        created: boolean
    } {
        options = defaultedOptions(options)

        // Always create new outer panel for modal and modeless
        if (!isDialog(options.location)) {
            const r = gridContainer.querySelector(`.${options.location}`)
            if (r) {
                if (options.resizeHandle && r.querySelectorAll('.drag').length === 0) {
                    r.appendChild(this.makeResizeHandle(options))
                }
                return {
                    outerPanel: r as HTMLDivElement,
                    created: false
                }
            }
        }

        const r = document.createElement('div')
        if (options.resizeHandle) {
            r.appendChild(this.makeResizeHandle(options))
        }
        if (options.location !== 'bottom' && options.location !== 'bottom-bar') {
            // tabs bring their own es-panel-header
            if (options.popOutButton || options.hideButton || isDialog(options.location)) {
                r.appendChild(this.makePanelHeaderBar(options))
            }
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
            this.styleWidthOrHeight(outerPanel, shadowDiv, options.location, options.initialWidthOrHeight)
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