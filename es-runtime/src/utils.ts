import type { Location } from "./es-api"

export function hidePanelsWithLocation(location: string) {
    for (const el of document.getElementsByClassName(location)) {
        if (el instanceof HTMLDivElement) {
            el.style.display = 'none'
        }
    }
}

export function locationFromDiv(div: HTMLDivElement) {
    return div.classList[1] as Location
}
