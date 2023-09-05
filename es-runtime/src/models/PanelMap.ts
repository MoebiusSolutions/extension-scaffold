import type { AddPanelOptions } from "../es-api";

export class PanelMap {
    private readonly PanelMap = new Map<string, AddPanelOptions>()

    get(id: string) {
        return this.PanelMap.get(id)
    }
    addPanel(id: string, options: AddPanelOptions) {
        this.PanelMap.set(id, options)
    }
}