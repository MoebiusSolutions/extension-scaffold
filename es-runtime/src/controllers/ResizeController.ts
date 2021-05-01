export function beginResize(dragDiv: HTMLDivElement, e: PointerEvent) {
    const parentDiv = dragDiv.parentElement
    if (!parentDiv) {
        return
    }

    const origPageX = e.pageX
    const origWidth = parentDiv.clientWidth

    function doResize(e: PointerEvent) {
        if (parentDiv) {
            const dx =  e.pageX - origPageX
            const newWidth = Math.max(100, origWidth + dx)
            parentDiv.style.width = `${newWidth}px`
        }
    }

    dragDiv.onpointermove = doResize
    dragDiv.setPointerCapture(e.pointerId)
}


export function endResize(dragDiv: HTMLDivElement, e: PointerEvent) {
    dragDiv.onpointermove = null
    dragDiv.releasePointerCapture(e.pointerId)
}
