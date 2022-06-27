import type { Location } from '../es-api'
import { getGridState, toStorage } from '../utils'
import { extensionScaffold } from './ExtensionController'
export interface ResizeData {
    panelDiv: HTMLElement
    extensionDiv: HTMLElement | HTMLDivElement
    origPageX: number
    origPageY: number
    origWidth: number
    origHeight: number
}

function updateHidden(size: number, dz: number,
    panelDiv: HTMLDivElement | HTMLElement,
    extensionDiv: HTMLDivElement | HTMLElement) {
    if (size === 100) {
        extensionScaffold.chrome.panels.hidePanel(extensionDiv.id)
    } else {
        extensionScaffold.chrome.panels.showPanel(extensionDiv.id)
    }
}

function applyLeft(rd: ResizeData, e: PointerEvent) {
    const w = window.innerWidth
    const dx = e.pageX - rd.origPageX
    const width = rd.origWidth + dx
    const newWidth = Math.min(Math.max(100, width), w / 2 - 100)
    rd.panelDiv.style.setProperty('--size', `${newWidth}px`)
    updateHidden(newWidth, dx, rd.panelDiv, rd.extensionDiv)
    if (newWidth === w / 2 - 100) {
        rd.panelDiv.classList.add('grid-expanded')
    } else {
        rd.panelDiv.classList.remove('grid-expanded')
    }
}

function applyRight(rd: ResizeData, e: PointerEvent) {
    const w = window.innerWidth
    const dx = -1 * (e.pageX - rd.origPageX)
    const width = rd.origWidth + dx
    const newWidth = Math.min(Math.max(100, width), w / 2 - 100)
    rd.panelDiv.style.setProperty('--size', `${newWidth}px`)
    updateHidden(newWidth, dx, rd.panelDiv, rd.extensionDiv)
    if (newWidth === w / 2 - 100) {
        rd.panelDiv.classList.add('grid-expanded')
    } else {
        rd.panelDiv.classList.remove('grid-expanded')
    }
}

function applyTop(rd: ResizeData, e: PointerEvent) {
    const h = window.innerHeight
    const dy = e.pageY - rd.origPageY
    const newHeight = Math.min(Math.max(100, rd.origHeight + dy), h / 2)
    rd.panelDiv.style.setProperty('--size', `${newHeight}px`)
    updateHidden(newHeight, dy, rd.panelDiv, rd.extensionDiv)
}

function applyBottom(rd: ResizeData, e: PointerEvent) {
    const h = window.innerHeight
    const dy = -1 * (e.pageY - rd.origPageY)
    const newHeight = Math.min(Math.max(100, rd.origHeight + dy), h / 2)
    rd.panelDiv.style.setProperty('--size', `${newHeight}px`)
    updateHidden(newHeight, dy, rd.panelDiv, rd.extensionDiv)
    if (newHeight === h / 2) {
        rd.panelDiv.classList.add('grid-expanded')
    } else {
        rd.panelDiv.classList.remove('grid-expanded')
    }
}

function doNothing() {
}

export function getApplyFunction(location: Location) {
    switch (location) {
        case 'left': return applyLeft
        case 'right': return applyRight
        case 'top': return applyTop
        case 'top-bar': return applyTop
        case 'bottom': return applyBottom
        case 'bottom-bar': return applyBottom
    }
    return doNothing
}

function savePanelDivSize(div: HTMLElement | null) {
    if (div === null) { return }
    const size = div.style.getPropertyValue('--size')
    if (!size) { return }
    
    const resizable = [ 'left', 'right', 'top', 'top-bar', 'bottom', 'bottom-bar' ]
    resizable.filter(l => div.classList.contains(l)).forEach(l => {
        toStorage(`${l}-panel-size`, size)
    })
}

export function beginResize(
    dragDiv: HTMLDivElement,
    e: PointerEvent,
    applyFunction: (rd: ResizeData, e: PointerEvent) => void) 
{
    if (e.button !== 0) {
        return
    }
    const panelDiv = dragDiv.parentElement
    if (!panelDiv) {
        return
    }
    savePanelDivSize(panelDiv)

    const extensionDiv = panelDiv.querySelector('.shadow-div.active') as HTMLDivElement
    if (!extensionDiv) {
        return
    }

    let verticalPadding = 0
    try{
        verticalPadding = parseInt(window.getComputedStyle(panelDiv).paddingTop) + parseInt(window.getComputedStyle(panelDiv).paddingBottom)
    } catch (e) {
        console.warn('Ignoring parseInt error')
    }
        
    const resizeData: ResizeData = {
        panelDiv,
        extensionDiv,
        origPageX: e.pageX,
        origPageY: e.pageY,
        origWidth: panelDiv.clientWidth,
        origHeight: panelDiv.clientHeight - verticalPadding,
    }

    function doResize(e: PointerEvent) {
        if (panelDiv) {
            applyFunction(resizeData, e)
        }
    }

    dragDiv.onpointermove = doResize
    dragDiv.setPointerCapture(e.pointerId)
}

export function endResize(dragDiv: HTMLDivElement, e: PointerEvent) {
    extensionScaffold.events.emit('grid-changed', getGridState())
    dragDiv.onpointermove = null
    dragDiv.releasePointerCapture(e.pointerId)
}
