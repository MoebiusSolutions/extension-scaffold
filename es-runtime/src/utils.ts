import type { Location, PanelState } from "./es-api"

export function hidePanelsWithLocation(location: string) {
    for (const el of document.getElementsByClassName(location)) {
        for (const child of el.children) {
            if (child.classList.contains('drag')) {
                continue
            }
            if (child instanceof HTMLDivElement) {
                child.style.display = 'none'
            }
        }
    }
}

export function setState(gridContainer: HTMLElement, loc: string, state: PanelState) {
    const r = gridContainer.querySelector(`.${loc}`)
    if (r) {
        const div = r as HTMLDivElement
        if (loc === 'left' || loc === 'right') {
            div.style.width = `${state.size}px`
        }
        else if (loc === 'top' || loc === 'bottom') {
            div.style.height = `${state.size}px`
        }
    }
}

export function withPanel(id: string, f: (parent: HTMLDivElement, div: HTMLDivElement) => void, ownerDocument: HTMLDocument = window.document): boolean {
    console.log('withPanel ID', id)
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
    return div.classList[1] as Location
}
