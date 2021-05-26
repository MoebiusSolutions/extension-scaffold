import type { PanelState, GridState } from "./es-api"
import { extensionScaffold } from "./controllers/ExtensionController"
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

export function getLocationdState(loc: string): PanelState {
    const d = document.querySelector(`.${loc}`)
    if (d !== null) {
        //@ts-ignore
        const div: HTMLDivElement = d
        //@ts-ignore
        const r = [...div?.querySelectorAll('.shadow-div')]
        //@ts-ignore
        const id = r.find(div => div.style.display !== 'none')?.id
        const size = div.style.width ? div.style.width : div.style.height
        return { size, activeId: (id === undefined ? null : id) }
    }
    return { size: '0px', activeId: null }
}

function applySize(loc: string, size: string) {
    const d = document.querySelector(`.${loc}`)
    if (d !== null) {
        //@ts-ignore
        const div: HTMLDivElement = d
        if (size.length < 1)
            return
        if (loc === 'left' || loc === 'right')
            div.style.width = size
        else if (loc === 'top' || loc === 'bottom')
            div.style.height = size
    }
}

export function setLocationState(loc: string, state: PanelState) {
    if (state.activeId) {
        extensionScaffold.showPanel(state.activeId)
    }
    applySize(loc, state.size)
}

export function applyGridState(gridstate: GridState) {
    setLocationState('left', gridstate.left)
    setLocationState('right', gridstate.right)
    setLocationState('top', gridstate.top)
    setLocationState('bottom', gridstate.bottom)
}

export function getGridState(): GridState {
    const gridstate: GridState = {
        left: { size: '0px', activeId: null }, right: { size: '0px', activeId: null },
        top: { size: '0px', activeId: null }, bottom: { size: '0px', activeId: null }
    }

    gridstate.left = getLocationdState('left')
    gridstate.right = getLocationdState('right')
    gridstate.top = getLocationdState('top')
    gridstate.bottom = getLocationdState('bottom')
    return gridstate
}

