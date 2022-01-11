import type { ExtensionIds, PanelState, GridState, Showing } from "./es-api"
import { extensionScaffold } from "./controllers/ExtensionController"
import { LOCATIONS } from "./es-api"

const storage = {}

function setStorageItem(key: string, val: string) {
    //@ts-ignore
    storage[key] = val
}

function getStorageItem(key: string) {
    //@ts-ignore
    if (storage[key] === undefined) {
        return null
    }
    //@ts-ignore
    return storage[key]
}

export function toJson(obj: GridState | ExtensionIds | string): string {
    const json = JSON.stringify(obj)
    return json
}

export function toObject(json: string | null): GridState | ExtensionIds | null {
    try {
        if (json === null) { return null }
        return JSON.parse(json)
    } catch (e) {
        return null
    }
}

export function toStorage(key: string, obj: GridState | ExtensionIds | string) {
    setStorageItem(key, toJson(obj))
}

export function fromStorage(key: string): GridState | ExtensionIds | string | null {
    return toObject(getStorageItem(key))
}

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
        const size = div.style.getPropertyValue('--size')
        const activeId = (id === undefined ? null : id)
        const isShown = !div.classList.contains('hidden')
        return { size, activeId, isShown }
    }
    return { size: '0px', activeId: null, isShown: false }
}

function showChanged(p: PanelState, q: PanelState): Showing {
    if (p.activeId === q.activeId) {
        if (p.isShown !== q.isShown) {
            return { id: p.activeId, showing: q.isShown }
        }
    }
    else {
        return { id: q.activeId, showing: q.isShown }
    }
    return { id: null, showing: false }
}

export function checkForShownChange(curGridstate: GridState, gridstate: GridState) {
    const sc = []
    if (curGridstate !== null) {
        const ext = fromStorage('track-ext-shown-change') as ExtensionIds
        if (ext !== null) {
            let s = showChanged(curGridstate.left, gridstate.left)
            if (s.id !== null && ext.ids.includes(s.id)) {
                sc.push(s)
            }
            s = showChanged(curGridstate.right, gridstate.right)
            if (s.id !== null && ext.ids.includes(s.id)) {
                sc.push(s)
            }
            s = showChanged(curGridstate.top, gridstate.top)
            if (s.id !== null && ext.ids.includes(s.id)) {
                sc.push(s)
            }
            s = showChanged(curGridstate.bottom, gridstate.bottom)
            if (s.id !== null && ext.ids.includes(s.id)) {
                sc.push(s)
            }
            if (sc.length > 0) {
                extensionScaffold.events.emit('ext-shown-changed', sc)
            }
        }
    }
}

function applySize(loc: string, size: string) {
    const d = document.querySelector(`.${loc}`)
    if (d !== null) {
        //@ts-ignore
        const div: HTMLDivElement = d
        if (size.length < 1) {
            return
        }
        div.style.setProperty('--size', size)
    }
}

export function setLocationState(loc: string, state: PanelState) {
    if (state.activeId) {
        extensionScaffold.chrome.panels.showPanel(state.activeId)
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
        left: { size: '0px', activeId: null, isShown: false }, right: { size: '0px', activeId: null, isShown: false },
        top: { size: '0px', activeId: null, isShown: false }, bottom: { size: '0px', activeId: null, isShown: false }
    }
    const curGridstate = fromStorage('gridstate') as GridState
    gridstate.left = getLocationdState('left')
    gridstate.right = getLocationdState('right')
    gridstate.top = getLocationdState('top')
    gridstate.bottom = getLocationdState('bottom')
    checkForShownChange(curGridstate, gridstate)
    toStorage('gridstate', gridstate)
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

export function appendIwcContext(url: string): string {
    const urlObject = new URL(url, window.location.href)
    const context = extensionScaffold.getContext()
    if (!context) { return url }
    if (context.iwc) {
        urlObject.searchParams.append('iwc', context.iwc)
    }
    if (context.busUrl) {
        urlObject.searchParams.append('busUrl', context.busUrl)
    }

    return urlObject.toJSON()
}
