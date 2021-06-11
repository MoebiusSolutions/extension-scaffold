import type { PanelState, GridState } from "./es-api"
import type { ResizeData } from './controllers/ResizeController'
import { extensionScaffold } from "./controllers/ExtensionController"
import { LOCATIONS } from "./es-api"

export function hidePanelsWithLocation(location: string) {
    for (const el of document.getElementsByClassName(location)) {
        for (const child of el.children) {
            if (child.classList.contains('shadow-div')) {
                const div = child as HTMLDivElement
                setInactive(div)
            }
        }
    }
}

export function showPanelsWithLocation(location: string) {
    for (const el of document.getElementsByClassName(location)) {
        for (const child of el.children) {
            if (child.classList.contains('shadow-div')) {
                const div = child as HTMLDivElement
                setActive(div)
            }
        }
    }
}

export function showPanelWithLocation(location: string, width: number) {
    for (const el of document.getElementsByClassName(location)) {
        for (const child of el.children) {
            if (child.classList.contains('shadow-div')) {
                const div = child as HTMLDivElement
                setActive(div)
                div.style.width = `${width}px`
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

export const isActive = (div: HTMLDivElement | HTMLElement) => div.classList.contains('active')

export const setActive = (div: HTMLDivElement) => div.classList.add('active')

export const setInactive = (div: HTMLDivElement) => div.classList.remove('active')

export function getLocationdState(loc: string): PanelState {
    const d = document.querySelector(`.${loc}`)
    if (d !== null) {
        //@ts-ignore
        const div: HTMLDivElement = d
        //@ts-ignore
        const r = [...div?.querySelectorAll('.shadow-div')]
        //@ts-ignore
        const id = r.find(div => isActive(div))?.id
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
        extensionScaffold.chrome.panels.showPanel(state.activeId)
    }
    applySize(loc, state.size)
}

export function applyGridState(gridstate: GridState) {
    console.log('applyGridState', gridstate)
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

export const copyStyles = (sourceDoc: HTMLDocument, targetDoc: HTMLDocument) => {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.disabled) {
            return
        }

        if (styleSheet.cssRules) { // for <style> elements
            const newStyleEl = sourceDoc.createElement('style')

            Array.from(styleSheet.cssRules).forEach(cssRule => {
                // write the text of each rule into the body of the style element
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText))
            })

            targetDoc.head.appendChild(newStyleEl)
        } else if (styleSheet.href) { // for <link> elements loading CSS from a URL
            const newLinkEl = sourceDoc.createElement('link')

            newLinkEl.rel = 'stylesheet'
            newLinkEl.href = styleSheet.href
            targetDoc.head.appendChild(newLinkEl)
        }
    })
    targetDoc.body.style.padding = '0px'
}

export function resize(width: number, newWidth: number, rd: ResizeData, location: string) {
    if (newWidth === 100) {
        rd.parentDiv.style.width = '2px'
        if (location === 'left') {
            hidePanelsWithLocation('above-left')
        }

    } else {
        rd.parentDiv.style.width = `${width}px`
        if (location === 'left') {
            showPanelWithLocation('above-left', width)
        }
    }
}
