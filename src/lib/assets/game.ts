import type { coord, Frameset, Tileset, TileSize } from "./types";
import currMap from "./map.json"
import { loadAllFrames } from "./character";
import { Player, directions, ALL_DIRECTIONS } from "./player"

let originalTileWidth = 32;
let safe = false
let lastTime: number = 0;
const MIN_TIMESTEP = 100;
let person : Frameset;
let imageObj: HTMLImageElement
let ctx: CanvasRenderingContext2D;
let tilesets: Tileset[];
let pressedKey: string | undefined;
let liftedKey: string | undefined;
let player: Player;
let collisionMap: [start: coord, blocking: boolean][][];
let fullUpdate: boolean = true;
let currWidth: number;
let paths: coord[][] = [
    [[52, 0 ], [52, 6 ], [47, 6 ], [47, 12], [40, 12], [40, 18], [33, 18], [33, 20]],
    [[65, 12], [61, 12], [61, 10], [55, 10], [55, 15], [51, 15], [51, 18], [33, 18], [33, 20]],
    [[65, 22], [60, 22], [60, 26], [42, 26], [42, 22], [33, 22], [33, 20]],
    [[65, 30], [61, 30], [61, 33], [44, 33], [44, 30], [38, 30], [38, 27], [35, 27], [35, 20], [33, 20]],
    [[ 0, 27], [ 4, 27], [ 4, 32], [14, 32], [14, 34], [30, 34], [30, 27], [32, 27], [32, 20], [33, 20]],
    [[ 0, 18], [ 1, 18], [ 1, 21], [11, 21], [11, 25], [19, 25], [19, 22], [33, 22], [33, 20]],
    [[14, 0 ], [14, 7 ], [20, 7 ], [20, 13], [28, 13], [28, 17], [33, 17], [33, 20]],
    [[ 0, 10], [ 5, 10], [ 5, 13], [15, 13], [15, 17], [33, 17], [33, 20]],
]
let currPath = Math.floor(Math.random()*paths.length);
let pathStep = 0;
let isReverse = false;

export function setup(
    _imageObj: HTMLImageElement, 
    _ctx: CanvasRenderingContext2D,
    tsets: Tileset[]
) {
    person = loadAllFrames();
    ctx = _ctx;
    imageObj = _imageObj;
    tilesets = tsets;
    safe = true;
    collisionMap = createCollisionMap()
    player = new Player(
        ctx, 
        collisionMap.map(r=>r.map(i=>i[1])), 
        [currMap.length, currMap[0].length],
        paths[currPath][0]
    )
}

function drawPerson(
    frameCoords: coord,
    c: coord,
    env: {
        cameraX: number,
        cameraY: number,
        resizeFactor: number,
        ctx: CanvasRenderingContext2D,
    }
) {
    const currTileWidth = originalTileWidth*env.resizeFactor
    env.ctx.drawImage(
        person.pic, //img

        frameCoords[0]*32,  //
        frameCoords[1]*64, //starting copying point

        32,   //
        64, //copy size

        Math.floor((c[0]*currTileWidth) + env.cameraX),          //
        Math.floor((c[1]*currTileWidth) -           //
            32*env.resizeFactor + env.cameraY), //pasting point

        Math.floor(currTileWidth), //
        Math.floor(2*currTileWidth) //paste size
    )
}

function drawTile(
    set: Tileset, 
    size: TileSize, 
    coords: coord,
    env: {
        cameraX: number,
        cameraY: number,
        resizeFactor: number,
        ctx: CanvasRenderingContext2D,
    },
    which?: number
) {
    const currTileWidth = originalTileWidth*env.resizeFactor
    let [startX, startY, tWidth, tHeight] = getData(size)
    const [x, y] = coords
    if (which != null) {
        startX += originalTileWidth * (which % (tWidth/originalTileWidth))
        startY += originalTileWidth * Math.floor(which / (tWidth/originalTileWidth))
        tWidth = originalTileWidth;
        tHeight = originalTileWidth;
    }
    env.ctx.drawImage(
        set.data, //img

        Math.floor(startX),  //
        Math.floor(startY), //starting copying point

        Math.floor(tWidth),   //
        Math.floor(tHeight), //copy size

        Math.floor((x*currTileWidth) + env.cameraX),          //
        Math.floor(((y+1)*currTileWidth) -           //
            tHeight*env.resizeFactor + env.cameraY), //pasting point

        Math.floor(tWidth*env.resizeFactor), //
        Math.floor(tHeight*env.resizeFactor) //paste size
    )
}

function drawBgTile(
    coords: coord,
    env: {
        cameraX: number,
        cameraY: number,
        resizeFactor: number,
        ctx: CanvasRenderingContext2D,
    }
) {
    const currTileWidth = originalTileWidth*env.resizeFactor
    const [x, y] = coords
    env.ctx.drawImage(
        imageObj, //img

        x*originalTileWidth,  //
        y*originalTileWidth, //starting copying point

        originalTileWidth,   //
        originalTileWidth, //copy size

        Math.floor((x*currTileWidth) + env.cameraX),          //
        Math.floor((y*currTileWidth) + env.cameraY), //pasting point

        Math.floor(currTileWidth), //
        Math.floor(currTileWidth) //paste size
    )
}

export function drawMap(
    timestamp: number,
) {
    if (!safe) return;
    if (timestamp-lastTime < MIN_TIMESTEP) {
        window.requestAnimationFrame((t)=>drawMap(t))
        return
    }
    
    let dFrame = Math.round((timestamp-lastTime)/MIN_TIMESTEP)
    let resizeFactor = currWidth / originalTileWidth
    let cameraX = -(imageObj.width*resizeFactor - ctx.canvas.width)/2
    let cameraY = -(imageObj.height*resizeFactor - ctx.canvas.height)/2
    let notDrawn = true;
    let env = {
        cameraX, cameraY, resizeFactor, ctx
    }

    registerKeyDown(pressedKey)
    if (liftedKey === pressedKey){
        registerKeyLeave(liftedKey)
    }
    pressedKey = undefined
    liftedKey = undefined

    if (!player.userControl){
        if (
            Math.round(player.position[0]) === paths[currPath][pathStep][0] &&
            Math.round(player.position[1]) === paths[currPath][pathStep][1]
        ) {
            isReverse? --pathStep : ++pathStep
        }
        if (isReverse? pathStep < 0 : pathStep === paths[currPath].length){
            isReverse = !isReverse;
            currPath = Math.floor(Math.random()*paths.length);
            pathStep = isReverse? paths[currPath].length-1 : 0
            if (pathStep === 0) {
                player.position = paths[currPath][0]
            }
        }
        player.setNextDir(calcNextDir());
    }

    let val = player.calcPos(dFrame);
    if (fullUpdate) {
        ctx.drawImage(
            imageObj, //img
            0, 0, //starting copying point
    
            imageObj.width,         //
            imageObj.height, //copy size
    
            cameraX,  //
            cameraY, //pasting point
    
            (imageObj.width) * resizeFactor,   //
            (imageObj.height) * resizeFactor  //paste size
        );
        (<(number|null)[][]>currMap).map((row, absY) => {
            row.map((_tile, absX) => {
                if (_tile != null) {
                    const retVal = tileInfoFromGIDX(_tile)
                    if (retVal) {
                        drawTile(
                            retVal[0], 
                            retVal[1], 
                            [absX, absY],
                            env
                        )
                    }
                }
                if (val) 
                if (val && notDrawn &&
                    Math.ceil(val[1][0]-0.001) === absX && 
                    Math.floor(val[1][1]-0.001) === absY
                ){
                    let [f, p, _] = val
                    drawPerson(f, p, env)
                    notDrawn = false
                }
            })
        });
        fullUpdate = false
    } else if (val) {
        let [f, p, oldP] = val
        let personCoords = [
            p,                      //feet
            <coord>[p[0], p[1]-1], //head
        ].concat(oldP !== p? [
            oldP, 
            <coord>[oldP[0], oldP[1]-1]
        ] : [])
        personCoords = personCoords
            .map(splitCoords)
            .flat()//split into whole tiles, flatten and remove out of world tiles
            .filter(c => (c[0]>0 && c[0]<currMap[0].length)&&(c[1]>=0 && c[1]<currMap.length-1));
        
        personCoords = Object.values(
            personCoords.reduce(
                (p: {[name: string]: coord},c) => (p[JSON.stringify(c)] = c,p),{}
            )
        ).sort((c1, c2)=>{
                if (c1[1] < c2[1]) return -1
                else if (c1[1] > c2[1]) return 1
                if (c1[0] < c2[0]) return -1
                return 1
            });
        
        personCoords.map(c=>{
            drawBgTile(c, env)
        })
        personCoords.map(c=>{
            const startOfObject = collisionMap[c[1]]?.[c[0]]?.[0]

            if (startOfObject){
                const tileHere = currMap[startOfObject[1]]?.[startOfObject[0]]
                if (tileHere != null) {
                    const retVal = tileInfoFromGIDX(tileHere)
                    if (retVal) {
                        const [set, size] = retVal
                        drawTile(
                            set, 
                            size, 
                            c,
                            env,
                            getWhich(c, startOfObject, size)
                        )
                    }
                }
            }
            
            if (Math.round(p[0]) === c[0] && 
                Math.round(p[1]-1) === c[1] &&
                notDrawn
            ){
                drawPerson(f, p, env)
                notDrawn = false
            }
        })
    }
    lastTime = timestamp;
}

function split(num: number): number[] {
    return Number.isInteger(num)? [num] : [Math.floor(num), Math.ceil(num)]
}

function splitCoords(p: coord): coord[] {
    let xs = split(p[0])
    return xs.map(
        x=>(split(p[1]).map(
            y=><coord>[x, y]
        )
    )).flat();
}

function getWhich(p: coord, start: coord, tile: TileSize): number | undefined{
    if (!tile.end) return undefined
    let width = tile.end[0]-tile.start[0]+1
    let height = tile.end[1]-tile.start[1]
    return (height-start[1]+p[1])*width + p[0] - start[0]
}

function tileInfoFromGIDX(idx: number | null): [Tileset, TileSize] | undefined {
    if (idx != null) {
        let i = tilesets.findIndex((s: { start: number; }) => {
            return s.start > idx
        })
        const set = tilesets[(i === -1? tilesets.length : i) - 1]
        if (set) {
            return [set, set.size[idx - set.start]]
        }
    }
}

function getData(tile: TileSize) {
    return [ 
        tile.start[0]*originalTileWidth, tile.start[1]*originalTileWidth,
        (tile.end? tile.end[0]-tile.start[0]+1: 1)*originalTileWidth,
        (tile.end? tile.end[1]-tile.start[1]+1: 1)*originalTileWidth,
    ]
}

function registerKeyDown(k: string | undefined) {
    const [x, y] = player.position;
    if ((k === "KeyW" || k === "ArrowUp")) {
        player.setNextDir(0)
        player.userControl = true;
    } else if ((k === "KeyA" || k === "ArrowLeft")) {
        player.setNextDir(3)
        player.userControl = true;
    } else if ((k === "KeyS" || k === "ArrowDown")) {
        player.setNextDir(2)
        player.userControl = true;
    } else if ((k === "KeyD" || k === "ArrowRight")) {
        player.setNextDir(1)
        player.userControl = true;
    }
}

function registerKeyLeave(k: string | undefined) {
    player.setNextDir(4)
}

export function handleKeydown(e: KeyboardEvent) {
    pressedKey = e.code
}

export function handleKeyup(e: KeyboardEvent) {
    liftedKey = e.code
}

function createCollisionMap() {
    let collisionMap: [coord, boolean][][] = [];
    (<(number|null)[][]>currMap).map((row, y) => {
        collisionMap[y] = []
        row.map((_tile, x) => {   
            if (_tile != null) {
                let idx = tilesets.findIndex((s: { start: number; }) => {
                    return s.start > _tile
                })
                const set = tilesets[(idx === -1? tilesets.length : idx) - 1]
                if (set && set.size[_tile - set.start].blocking) {
                    let sz = set.size[_tile - set.start]
                    if (!sz.end){
                        collisionMap[y][x] = [[x, y], true];
                    } else {
                        let width = sz.end[0]-sz.start[0]+1
                        let height = sz.end[1]-sz.start[1]+1
                        let _i = 0;
                        for (let _y = 0; _y < height; _y++) {
                            for (let _x = 0; _x < width; _x++) {
                                try {
                                    collisionMap[y-height+_y+1][x+_x] = 
                                        [[x, y], sz.blocking!.includes(_i)];
                                } catch(e) {}
                                _i++
                            }
                        }
                    }
                }
            }
        })
    });

    return collisionMap!
}

export function handleResize(newWidth: number) { 
    currWidth = newWidth;
    fullUpdate = true;
}

function calcNextDir(): directions {
    const f = (n: number, m: number) => {
        return n>m? 1 : n<m? -1 : 0
    }
    let nextDir: coord = [
        f(
            paths[currPath][pathStep][0], 
            Math.round(player.position[0])
        ), 
        f(
            paths[currPath][pathStep][1], 
            Math.round(player.position[1])
        )
    ]
    if (nextDir[0] && nextDir[1]){
        let diffs = [
            Math.abs(player.position[0]-paths[currPath][pathStep][0]),
            Math.abs(player.position[1]-paths[currPath][pathStep][1])
        ]
        let lesser = diffs.indexOf(Math.min(...diffs))
        nextDir = [
            lesser ? 0 : f(paths[currPath][pathStep][0], player.position[0]),
            lesser ? f(paths[currPath][pathStep][1], player.position[1]) : 0
        ]
        
    }

    const d = ALL_DIRECTIONS.findIndex(d=>nextDir[0]===d[0]&&nextDir[1]===d[1])
    return d === -1? 4 : d
}