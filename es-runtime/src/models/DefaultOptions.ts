import type { AddPanelOptions, Location } from "../es-api"

/**
 * Some panel locations have a resize handle, pop out, etc. by default.
 */
export function defaultedOptions(options: AddPanelOptions) {
    interface Defaults {
        match: Location[]
        options: Partial<AddPanelOptions>
    }
    const defaults: Defaults[] = [
        {
            match: ['left', 'right', 'top', 'bottom'],
            options: {
                resizeHandle: true,
                popOutButton: true,
                expandButton: true,
                hideButton: true,
            }
        },
        {
            match: ['bottom-bar'],
            options: {
                resizeHandle: true,
                expandButton: true,
                hideButton: true,
            }
        },
    ]
    const def = defaults.find(d => d.match.findIndex(m => m === options.location) >= 0)
    return {
        ...def?.options,
        ...options,
    }
}
