export interface AddPanelOptions {
    // Note that center will shrink the center panel when other
    // panels are open. For example, if a left and right panel
    // are open then the center panel will be smaller.
    // The `body` location will not be resized. Instead it will
    // be under any open panels. This works well for when
    // the map is set to `body` so that the map, does not need
    // to resize as panels open/close
    location: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'body'
    id: string
    resizeHandle?: boolean
}

export interface ExtensionScaffoldApi {
    ping: () => void
    addPanel: (options: AddPanelOptions) => Promise<HTMLDivElement>
    hidePanel: (id: string) => void
}
