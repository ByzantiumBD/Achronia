import char from "./character_achronia.png"
import type { Frameset } from "./types"


export function loadAllFrames(): Frameset{
    var imageObj = new Image();
    imageObj.src = char; 
    return {
        still: {
            down: [
                [0,0],[0,0],[0,0],[0,0],[0,0],
                [0,0],[0,0],[0,0],[0,0],[0,0],
                [0,1],[0,1],[0,1],[0,1],[0,1],
                [0,1],[0,1],[0,1],[0,1],[0,1],
                [0,0],[0,0],[0,0],[0,2],[0,2],
                [0,0],[0,0],[0,0],[0,0],[0,0],
                [0,1],[0,1],[0,1],[0,1],[0,1],
                [0,1],[0,1],[0,1],[0,1],[0,1],
            ],
            up: [
                [1,0],[1,0],[1,0],[1,0],[1,0],
                [1,0],[1,0],[1,0],[1,0],[1,0],
                [1,1],[1,1],[1,1],[1,1],[1,1],
                [1,1],[1,1],[1,1],[1,1],[1,1],
                [1,0],[1,0],[1,0],[1,2],[1,2],
                [1,0],[1,0],[1,0],[1,0],[1,0],
                [1,1],[1,1],[1,1],[1,1],[1,1],
                [1,1],[1,1],[1,1],[1,1],[1,1],
            ],
            right: [
                [2,0],[2,0],[2,0],[2,0],[2,0],
                [2,0],[2,0],[2,0],[2,0],[2,0],
                [2,1],[2,1],[2,1],[2,1],[2,1],
                [2,1],[2,1],[2,1],[2,1],[2,1],
                [2,0],[2,0],[2,0],[2,2],[2,2],
                [2,0],[2,0],[2,0],[2,0],[2,0],
                [2,1],[2,1],[2,1],[2,1],[2,1],
                [2,1],[2,1],[2,1],[2,1],[2,1],
            ],
            left: [
                [3,0],[3,0],[3,0],[3,0],[3,0],
                [3,0],[3,0],[3,0],[3,0],[3,0],
                [3,1],[3,1],[3,1],[3,1],[3,1],
                [3,1],[3,1],[3,1],[3,1],[3,1],
                [3,0],[3,0],[3,0],[3,2],[3,2],
                [3,0],[3,0],[3,0],[3,0],[3,0],
                [3,1],[3,1],[3,1],[3,1],[3,1],
                [3,1],[3,1],[3,1],[3,1],[3,1],
            ]
        },
        walk: {
            down: 
            [
                [[0,3],[0,4],[0,5],[0,0]],
                [[0,6],[0,7],[0,8],[0,0]],

            ],
            up: [
                [[1,3],[1,4],[1,5],[1,0]],
                [[1,6],[1,7],[1,8],[1,0]],
            ],
            right: [
                [[2,3],[2,4],[2,5],[2,0]],
                [[2,6],[2,7],[2,8],[2,0]],
            ],
            left: [
                [[3,3],[3,4],[3,5],[3,0]],
                [[3,6],[3,7],[3,8],[3,0]],
            ]
        },
        pic: imageObj
    }
}