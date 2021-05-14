import './es-runtime.css'
import './theme.css'

import { extensionScaffold } from './controllers/ExtensionController'

export type Location =
    'header' |
    'above-left' |
    'above-right' |
    'left-bar' |
    'right-bar' |
    'left' |
    'right' |
    'top' |
    'bottom' |
    'center' |
    'footer'

export interface AddPanelOptions {
    location: Location
    id: string
    title?: string
    resizeHandle?: boolean
    initialWidthOrHeight?: string // defaults to "30em"
    iframeSource?: string // injects an iframe if set
    panelState?: string
}

export interface LoadWebpackScriptOptions {
    /** relative URLs will use scaffolds URL prefix */
    url: string
    /** Name of library injected onto window. Accessed as window[`${library}`] */
    library: string
}

export type PanelState = {
    size: number
    activeId: string | null
}

export interface GridState {
    left: PanelState
    right: PanelState
    top: PanelState
    bottom: PanelState
}

export interface ExtensionScaffoldApi {
    boot: (gridContainer: HTMLElement | null) => void

    loadExtension: (url: string) => void

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
    getGridState: () => GridState
    onGridStateChange: (onChange: (gs: GridState) => void) => void
    /**
     * Webpack does not currently have a non-experimental means to generate an ES module.
     * To workaround this issue, declare a small extension, that then calls this method.
     */
    loadWebpackScript: (options: LoadWebpackScriptOptions) => Promise<any>
}

// api.chrome.addPanel

// api.service.register('event', myservice)
// thatservice = api.service.get('event')
// thatservice.latLngRngBrg2LatLn()

export { extensionScaffold }
