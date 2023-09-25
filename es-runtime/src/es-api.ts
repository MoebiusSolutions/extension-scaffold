import './es-runtime.css'
import './theme.css'

import { extensionScaffold } from './controllers/ExtensionController'
import type { EventEmitter } from 'events'
import type { ReactNode } from 'react';

export const LOCATIONS = [
    'header',
    'above-left',
    'above-right',
    'top-bar',
    'bottom-bar',
    'left-bar',
    'right-bar',
    'left',
    'right',
    'top',
    'bottom',
    'center',
    'footer',
    'portal',
    'portal-wide',
    'modal',
    'modeless',
] as const

export type Location = typeof LOCATIONS[number]

export type SubLocation =
    'left' |
    'right' |
    'top' |
    'bottom'

export type Event = 'grid-changed' | 'ext-shown-changed'

export type InitialWidthOrHeight = string | {
    width?: string
    height?: string
}

export interface AddPanelOptions {
    location: Location
    id: string
    icon?: HTMLElement
    title?: string
    resizeHandle?: boolean
    popOutButton?: boolean
    expandButton?: boolean
    hideButton?: boolean
    removeButton?: boolean

    /** Defaults to "30em" */
    initialWidthOrHeight?: InitialWidthOrHeight

    /** URL of iframe to place in panel, if set */
    iframeSource?: string

    /** Connects the iframe, but does not show it in the UI - useful for background iframes */
    hidden?: boolean

    /** Ignore initial JSON location */
    relocating?: boolean
}

export interface LoadWebpackScriptOptions {
    /** relative URLs will use scaffolds URL prefix */
    url: string
    /** Name of library injected onto window. Accessed as window[`${library}`] */
    library: string
}
export interface PanelState {
    size: string
    activeId: string | null
    isShown: boolean
    isExpanded: boolean
}
export interface ExtensionIds {
    ids: string[]
}

export interface Fulfilled {
    status: "fulfilled",
    value: any
}

export interface Rejected {
    status: "rejected",
    reason: any
}

export interface Showing {
    id: string | null
    showing: boolean
}

export interface GridState {
    left: PanelState
    right: PanelState
    top: PanelState
    bottom: PanelState
}

export interface HistoryType {
    type: string
}

export interface OrigSize {
    size: string
    location: Location | ''
}

export interface Panels {
    /** Panels "stack" in a location */
    addPanel: (options: AddPanelOptions) => Promise<HTMLDivElement>
    /**
     * Removing restores the top panel in the remaining stack
     * @param {string} id Panel ID
     */
    removePanel: (id: string) => boolean
    /** 
     * @param {string} id Panel ID
     * @param {boolean} pushToHistory 
     *  Determines if the `gridstate` should be pushed onto history stack. 
     * 
     *  Defaults to `true`.
     */
    hidePanel: (id: string, pushToHistory?: boolean) => boolean
    /**
     * @param {string} id Panel ID
     * @param {boolean} pushToHistory Defaults to `true`
     */
    showPanel: (id: string, pushToHistory?: boolean) => boolean
    isPanelHidden: (id: string) => boolean
    /**
     * Show if `id` is hidden, otherwise hide `id` 
     * @param {string} id Panel ID
     */
    togglePanel: (id: string, pushToHistory?: boolean) => boolean
    /**
     * Maximizes panel over center
     * @param {string} id Panel ID
     */
    maximizePanel: (id: string) => void
    /**
     * @param {string} id ID of panel
     * @param {boolean} pushHistory Defaults to `true`
     */
    expandPanel: (id: string, pushToHistory?: boolean) => void
    /** 
     * Restore from maximized or expanded 
     * @param {string} id ID of panel
     * @param {boolean} pushToHistory Defaults to `true`
     */
    restorePanel: (id: string, pushToHistory?: boolean) => void
    closeLocation: (location: Location) => void

    popOutPanel: (id: string, pushToHistory?: boolean) => boolean
    popInPanel: (id: string, pushToHistory?: boolean) => boolean
    isPanelPoppedOut: (id: string) => boolean
    trackExtensions: (ids: ExtensionIds) => void

    panelIds: (location: Location) => AddPanelOptions[] | undefined
}

export interface RibbonBar {
    claimRibbonTab: (title: string) => HTMLDivElement | null
    claimRibbonPanel: (id: string) => HTMLDivElement | null
    showRibbonTab: (id: string) => HTMLDivElement | null
    hideRibbonTab: (id: string) => HTMLDivElement | null
    components?: {
        [key: string]: ReactNode;
    }
}

export interface Chrome {
    readonly ribbonBar: RibbonBar
    readonly panels: Panels
}

export interface ExtensionScaffoldApi {
    readonly chrome: Chrome
    readonly events: EventEmitter
    /**
     * Exposed the gridContainer that was passed into `boot`.
     * An example use case would be to add a className to indicate a theme:
     * ```
     * api.gridContainer.classList.add('light')
     * ```
     */
    readonly gridContainer: HTMLElement

    /**
     * Warning: this API is under consideration. The `context` may be added
     * as a parameter to `boot` instead of allowing any extension with
     * the api reference a chance to call this method
     * 
     * @deprecated
     * @param context 
     */
    setContext: (context: any | null) => void
    getContext: () =>  any | null

    boot: (gridContainer: HTMLElement | null) => void

    loadExtensions: (urls: string[], gridState?: GridState) => Promise<(Fulfilled | Rejected)[]>

    /**
     * Webpack does not currently have a non-experimental means to generate an ES module.
     * To workaround this issue, declare a small extension, that then calls this method.
     */
    loadWebpackScript: (options: LoadWebpackScriptOptions) => Promise<any>

    /**
     * `es-home` provides an implementation of the RibbonBar.
     * However, an alternate hosting page could provide an alternate implementation.
     */
    provideRibbonBar: (ribbonBar: RibbonBar) => RibbonBar
}

export { extensionScaffold }
