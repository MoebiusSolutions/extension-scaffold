import { EventEmitter } from 'events'

export type Event = 'grid-changed'

const event = new EventEmitter()

export type EventMethods = {
    emit: (val: any) => boolean
    on: (f: (e: any) => void) => EventEmitter
}

export const use_Event = (type: Event): EventMethods => {
    const emit = (val: any) => event.emit(type, val)
    const on = (f: (e: any) => void) => event.on(type, f)
    return { emit, on }
}