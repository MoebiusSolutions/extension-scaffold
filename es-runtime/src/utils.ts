import { LOCATIONS } from "./es-api"

export function hidePanelsWithLocation(location: string) {
    for (const el of document.getElementsByClassName(location)) {
        for (const child of el.children) {
            if (child.classList.contains('shadow-div')) {
                const div = child as HTMLDivElement
                div.style.display = 'none'
            }
        }
    }
}

export function withGrid(location: string, f: (div: HTMLDivElement) => void) {
    for (const el of document.getElementsByClassName(location)) {
        if (el instanceof HTMLDivElement) {
            f(el)
        }
    }
}

export function withPanel(id: string, f: (parent: HTMLDivElement, div: HTMLDivElement) => void, ownerDocument: HTMLDocument = window.document): boolean {
    const div = ownerDocument.getElementById(id) as HTMLDivElement
    if (!div) {
        console.warn('Panel id not found', id)
        return false
    }
    const parent = div.parentElement
    if (!(parent instanceof HTMLDivElement)) {
        return false
    }

    f(parent, div)
    return true
}

export function locationFromDiv(div: HTMLDivElement) {
    const r = LOCATIONS.find(loc => div.classList.contains(loc))
    if (r) {
        return r
    }
    throw new Error('Div does not have a location class')
}
