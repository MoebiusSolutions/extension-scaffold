import type { Location } from '../es-api'
import { getGridState } from '../utils'
import { extensionScaffold } from './ExtensionController'
export interface ResizeData {
    panelDiv: HTMLElement
    extensionDiv: HTMLElement | HTMLDivElement
    origPageX: number
    origPageY: number
    origWidth: number
    origHeight: number
}

function updateHidden(size: number, extensionDiv: HTMLDivElement | HTMLElement) {
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
    rd.panelDiv.style.width = `${newWidth}px`
    updateHidden(newWidth, rd.extensionDiv)
}

function applyTop(rd: ResizeData, e: PointerEvent) {
    const h = window.innerHeight
    const dy = e.pageY - rd.origPageY
    const newHeight = Math.min(Math.max(100, rd.origHeight + dy), h / 2)
    rd.panelDiv.style.height = `${newHeight}px`
    updateHidden(newHeight, rd.extensionDiv)
}

function applyRight(rd: ResizeData, e: PointerEvent) {
    const w = window.innerWidth
    const dx = -1 * (e.pageX - rd.origPageX)
    const width = rd.origWidth + dx
    const newWidth = Math.min(Math.max(100, width), w / 2 - 100)
    rd.panelDiv.style.width = `${newWidth}px`
    updateHidden(newWidth, rd.extensionDiv)
}

function applyBottom(rd: ResizeData, e: PointerEvent) {
    const h = window.innerHeight
    const dy = -1 * (e.pageY - rd.origPageY)
    const newHeight = Math.min(Math.max(100, rd.origHeight + dy), h / 2)
    rd.panelDiv.style.height = `${newHeight}px`
    updateHidden(newHeight, rd.extensionDiv)
}

function doNothing() {
}

export function getApplyFunction(location: Location) {
    switch (location) {
        case 'left': return applyLeft
        case 'right': return applyRight
        case 'top': return applyTop
        case 'bottom': return applyBottom
    }
    return doNothing
}

export function beginResize(
    dragDiv: HTMLDivElement,
    e: PointerEvent,
    applyFunction: (rd: ResizeData, e: PointerEvent) => void) {
    const panelDiv = dragDiv.parentElement
    if (!panelDiv) {
        return
    }

    const extensionDiv = panelDiv.querySelector('.active') as HTMLDivElement
    if (!extensionDiv) {
        return
    }

    const resizeData: ResizeData = {
        panelDiv,
        extensionDiv,
        origPageX: e.pageX,
        origPageY: e.pageY,
        origWidth: panelDiv.clientWidth,
        origHeight: panelDiv.clientHeight,
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
