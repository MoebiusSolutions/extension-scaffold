import './es-runtime.css'
import './theme.css'

import { extensionScaffold } from './controllers/ExtensionController'
import type EventEmitter from 'events'

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
] as const

export type Location = typeof LOCATIONS[number]

export type SubLocation =
    'left' |
    'right' |
    'top' |
    'bottom'

export type Event = 'grid-changed' | 'ext-shown-changed'

export interface AddPanelOptions {
    location: Location
    id: string
    icon?: HTMLElement
    title?: string
    resizeHandle?: boolean
    popOutButton?: boolean
    hideButton?: boolean
    initialWidthOrHeight?: string // defaults to "30em"
    iframeSource?: string // injects an iframe if set
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

export interface OrigSize {
    size: string
    location: Location | ''
}

export interface Panels {
    /** Panels "stack" in a location */
    addPanel: (options: AddPanelOptions) => Promise<HTMLDivElement>
    /** Removing restores the top panel in the remaining stack */
    removePanel: (id: string) => boolean
    hidePanel: (id: string) => boolean
    showPanel: (id: string) => boolean
    /** show if `id` is hidden, otherwise hide `id` */
    togglePanel: (id: string) => boolean
    maximizePanel: (id: string) => void
    restorePanel: (id: string) => void

    popOutPanel: (id: string) => boolean
    popInPanel: (id: string) => boolean
    isPanelPoppedOut: (id: string) => boolean
    trackExtensions: (ids: ExtensionIds) => void

    panelIds: (location: Location) => AddPanelOptions[] | undefined
}

export interface RibbonBar {
    claimRibbonTab: (title: string) => HTMLDivElement | null
    claimRibbonPanel: (id: string) => HTMLDivElement | null
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
