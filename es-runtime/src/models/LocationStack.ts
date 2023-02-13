import type { Location, AddPanelOptions } from "../es-api";

export class LocationStack {
    private readonly locationStack = new Map<Location, AddPanelOptions[]>()

    get(location: Location) {
        return this.locationStack.get(location)
    }
    pushLocation(location: Location, options: AddPanelOptions) {
        const stack = this.locationStack.get(location) ?? []
        this.locationStack.set(location, [options, ...stack]) // needed for first time
    }
    popLocation(location: Location, id: string) {
        const stack = this.locationStack.get(location) ?? []
        this.locationStack.set(location, stack.filter(opt => opt.id !== id)) // needed for first time
        return this.panelsAtLocation(location)[0]?.id
    }
    panelsAtLocation(location: Location) {
        return this.locationStack.get(location) ?? []
    }
}
