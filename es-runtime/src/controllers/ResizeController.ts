import type { Location } from '../es-api'
import * as pl from './storage'
export interface ResizeData {
    parentDiv: HTMLElement
    origPageX: number
    origPageY: number
    origWidth: number
    origHeight: number
}

var h = window.innerHeight
function applyLeft(rd: ResizeData, e: PointerEvent) {
    const w = window.innerWidth
    const dx = e.pageX - rd.origPageX
    const newWidth = Math.min(Math.max(100, rd.origWidth + dx), w / 2 - 100)

    rd.parentDiv.style.width = `${newWidth}px`
}

function applyTop(rd: ResizeData, e: PointerEvent) {
    const h = window.innerHeight
    const dy = e.pageY - rd.origPageY
    const newHeight = Math.min(Math.max(100, rd.origHeight + dy), h / 2)

    rd.parentDiv.style.height = `${newHeight}px`
}
function applyRight(rd: ResizeData, e: PointerEvent) {
    const w = window.innerWidth
    const dx = -1 * (e.pageX - rd.origPageX)
    const newWidth = Math.min(Math.max(100, rd.origWidth + dx), w / 2 - 100)

    rd.parentDiv.style.width = `${newWidth}px`
}
function applyBottom(rd: ResizeData, e: PointerEvent) {
    const h = window.innerHeight
    const dy = -1 * (e.pageY - rd.origPageY)
    const newHeight = Math.min(Math.max(100, rd.origHeight + dy), h / 2)

    rd.parentDiv.style.height = `${newHeight}px`
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
    const parentDiv = dragDiv.parentElement
    if (!parentDiv) {
        return
    }

    const resizeData: ResizeData = {
        parentDiv,
        origPageX: e.pageX,
        origPageY: e.pageY,
        origWidth: parentDiv.clientWidth,
        origHeight: parentDiv.clientHeight,
    }

    function doResize(e: PointerEvent) {
        if (parentDiv) {
            applyFunction(resizeData, e)
        }
    }

    dragDiv.onpointermove = doResize
    dragDiv.setPointerCapture(e.pointerId)
}


export function endResize(dragDiv: HTMLDivElement, e: PointerEvent) {

    dragDiv.onpointermove = null
    dragDiv.releasePointerCapture(e.pointerId)
}
