export function hidePanelsWithLocation(location: string) {
    for (const el of document.getElementsByClassName(location)) {
        if (el instanceof HTMLDivElement) {
            el.style.display = 'none'
        }
    }
}
