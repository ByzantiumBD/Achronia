export type Tileset = {
    start: number,
    name: string,
    data: HTMLImageElement,
    size: TileSize[]
}

export type coord = [x: number, y: number]

export type TileSize = {
    start: coord,
    end?: coord,
    blocking?: number[]
}

export type Frameset = {
    still: {
        down: coord[],
        up: coord[],
        right: coord[],
        left: coord[]
    },
    walk: {
        down: coord[][],
        up: coord[][],
        right: coord[][],
        left: coord[][]
    },
    pic: HTMLImageElement
}