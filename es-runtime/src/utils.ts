import type { Location } from "./es-api"

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
        // if (el instanceof HTMLDivElement) {
        //     el.style.display = 'none'
        // }
    }
}

export function locationFromDiv(div: HTMLDivElement) {
    return div.classList[1] as Location
}
