import type { coord, Frameset, Tileset } from "./types";
import { loadAllFrames } from "./character";

export enum directions {
    up = 0,
    right = 1,
    down = 2,
    left = 3,
    none = 4
}

export const ALL_DIRECTIONS: coord[] = [[0,-1],[1, 0],[0,1],[-1,0],[0,0]]

export class Player {
    public safe = false
    public person : Frameset;
    public position: coord;
    private _dir: directions = directions.none
    public _lastDir = directions.down
    public _nextDir = directions.none
    public moveStart: number = 0;
    public lastLegUsed: number = 0;
    public speed: number;
    public walkFrames: [coord[][],coord[][],coord[][],coord[][]]
    public stillFrames: [coord[],coord[],coord[],coord[]]
    public lastFrame: number = -1
    public cmap: boolean[][];
    public worldSize: coord;
    public userControl = false;

    constructor(
        _ctx: CanvasRenderingContext2D,
        _cmap: boolean[][],
        _wSize: coord,
        _pos: coord
    ) {
        this.person = loadAllFrames();
        this.position = _pos;
        this.safe = true;
        this.speed = 1/this.person.walk.up[0].length //tiles / frame
        this.walkFrames = [
            this.person.walk.up,
            this.person.walk.right,
            this.person.walk.down,
            this.person.walk.left,
        ]
        this.stillFrames = [
            this.person.still.up,
            this.person.still.right,
            this.person.still.down,
            this.person.still.left,
        ]
        this.cmap = _cmap
        this.worldSize = _wSize
    }

    calcPos(
        dFrame: number
    ): [frame: coord, pos: coord, oldPos: coord] | undefined {
        if (dFrame > 5) return
        let frames: coord[], f: coord;
        let old = this.position;
        if (this.moving) {
            const checkPos = [
                Math.round(this.position[0]+(this.dir[0]*0.6)),
                Math.round(this.position[1]+(this.dir[1]*0.6))
            ]
            
            if (!this.cmap[checkPos[1]]?.[checkPos[0]] && //either empty or out of world
                (!this.userControl || //check out of world only if controlled by user 
                    ((checkPos[0]>0 && checkPos[0]<this.worldSize[1])//not outside the world
                    && (checkPos[1]>0 && checkPos[1]<this.worldSize[0]-1))
                )
            ){
                    this.position = [
                        this.position[0] + (this.dir[0]*this.speed*dFrame),
                        this.position[1] + (this.dir[1]*this.speed*dFrame),
                    ]
            } else {
                this.position = <coord>this.position.map(Math.round)
            }
            frames = this.walkFrames[Math.min(this._dir, 3)][this.lastLegUsed? 0 : 1]
            this.lastFrame = (this.lastFrame + dFrame) % frames.length
            f = frames[this.lastFrame]
            if (this.lastFrame === frames.length-1){
                this.lastLegUsed = this.lastLegUsed? 0 : 1
                this._dir = this._nextDir
                this._nextDir = directions.none
            }
        } else {
            frames = this.stillFrames[Math.min(this._lastDir, 3)]
            this.lastFrame = (this.lastFrame + dFrame) % frames.length
            f = frames[this.lastFrame]            
        }
        return [
            f,
            this.position, 
            old
        ]
    }

    setNextDir(newDir: directions) {
        if(!this.moving && this._dir !== newDir){
            this._dir = newDir;
            this.lastFrame = -1
        } else if (!this.moving) {
            this.position = <coord>this.position.map(Math.round)
        }
        this._nextDir = newDir;
        this._lastDir = this._dir === directions.none ? this._lastDir : this._dir
    }

    get dir() { return ALL_DIRECTIONS[this._dir] }
    get lastDir() { return ALL_DIRECTIONS[this._lastDir] }

    get moving() {
        return this.dir[0] || this.dir[1]
    }
}