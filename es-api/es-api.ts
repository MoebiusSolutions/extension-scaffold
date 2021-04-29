const LOCATIONS = [
    'header',
    'above-left',
    'above-right',
    'left-bar',
    'right-bar',
    'left',
    'right',
    'top',
    'bottom',
    'center',
    'footer',
] as const;

export interface ClaimPanelOptions {
    // Note that center will shrink the center panel when other
    // panels are open. For example, if a left and right panel
    // are open then the center panel will be smaller.
    // The `body` location will not be resized. Instead it will
    // be under any open panels. This works well for when
    // the map is set to `body` so that the map, does not need
    // to resize as panels open/close
    location: typeof LOCATIONS[number]
    id: string
    resizeHandle?: boolean
    initialWidthOrHeight?: string // defaults to "30em"
}

export interface ExtensionScaffoldApi {
    ping: () => void
    claimPanel: (options: ClaimPanelOptions) => Promise<HTMLDivElement>
    releasePanel: (id: string) => boolean
    hidePanel: (id: string) => void
    maximizePanel: (id: string) => void
    restorePanel: (id: string) => void
}
