import type { TileSize } from "./types"

const infos: allTilesetsInfo = {
    Natural_object: [
        {
            start: [0, 0],
            end: [1, 2],
            blocking: [2, 3, 4, 5]
        },
        {
            start: [2, 0],
            blocking: [0]
        },
        {
            start: [3, 0],
            blocking: [0]
        },
        {
            start: [4, 0],
            end: [5, 1],
            blocking: [2, 3]
        },
        {
            start: [6, 0],
            end: [7, 1],
            blocking: [2, 3]
        },
        {
            start: [2, 1],
            blocking: [0]
        },
        {
            start: [3, 1],
            blocking: [0]
        },
        {
            start: [2, 2],
            blocking: [0]
        },
        {
            start: [3, 2],
        },
        {
            start: [4, 2],
            blocking: [0]
        }
    ]
}

export type allTilesetsInfo = {
    [tilesetName: string]: TileSize[]
}

export default infos