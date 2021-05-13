export type state = {
    id: string;
    size: number;
    closed: boolean;
}


const storageToMap = () => {
    if (localStorage.myMap !== undefined) {
        try {
            return new Map(JSON.parse(localStorage.myMap))
        } catch (e) {
            return new Map()
        }
    }
    return new Map()
}

const mapToJSON = (map: any) => JSON.stringify(Array.from(map.entries()))

export const setItem = (key: string, val: any) => {
    const map = storageToMap()
    map.set(key, val)
    localStorage.myMap = mapToJSON(map)
}

export const getItem = (key: string): any => {
    const map = storageToMap()
    return map.get(key)
}

export const deleteAll = () => {
    localStorage.clear()
}

export const getAll = () => storageToMap()

export default {
    setItem,
    getItem,
    getAll
}


/*

let map = new Map()

const toJson = (id: string, size: number, closed: boolean) => {
    return {
        'id': id,
        'size': size,
        'closed': closed
    }
}

const toStorage = () => {
    localStorage.layoutMap = JSON.stringify(Array.from(map.entries()))
}

const fromStorage = () => {
    if (localStorage.layoutMap !== undefined) {
        map = new Map(JSON.parse(localStorage.layoutMap))
    }
    map = new Map()
}

const save = (id: string, size: number, closed: boolean): void => {
    map.set(id, { size, closed })
}

const get = (key: string) => {
    const val = map.get(key)
    return val === undefined ? '' : val
}

const remove = (key: string) => map.delete(key)

const getSize = () => map.size

const deleteAll = () => {
    for (let k of map.keys()) {
        remove(k)
    }
}

const getMap = () => map


export default {
    save,
    get,
    toJson,
    toStorage,
    fromStorage,
    remove,
    getSize,
    getMap,
    deleteAll
}
*/




