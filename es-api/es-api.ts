type Location = 
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
    resizeHandle?: boolean
    initialWidthOrHeight?: string // defaults to "30em"
}

export interface ExtensionScaffoldApi {
    ping: () => void
    /** Panels "stack" in a location */
    addPanel: (options: AddPanelOptions) => Promise<HTMLDivElement>
    /** Removing restores the top panel in the remaining stack */
    removePanel: (id: string) => boolean
    hidePanel: (id: string) => boolean
    showPanel: (id: string) => boolean
    maximizePanel: (id: string) => void
    restorePanel: (id: string) => void
}
