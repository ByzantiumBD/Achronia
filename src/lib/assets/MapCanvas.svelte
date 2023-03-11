<script lang="ts">
    import base from "./base.png"
	import { onMount } from "svelte";
	import type { coord, Frameset, Tileset, TileSize } from "./types";
    import currMap from "./map.json"
	import { loadAllTiles } from "./loadtiles";
	import { loadAllFrames } from "./character";

    export let style: string = "";
    let originalTileWidth = 32;
    let tilesets: Tileset[];
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let currTileWidth: number, width: number, height: number;
    let imageObj: HTMLImageElement;
    let safe = false
    let lastTime: number = 0;
    let person: Frameset
    const MIN_TIMESTEP = 80;
    let personCoords: coord = [18,2]
    let personSpeed: coord = [0,0]
    let startAnim: number | undefined;
    let prevSpeed: coord = [0, 0];
    let nextSpeed: coord = [0, 0]
    let lastPlayed = 0;

    $: {
        currTileWidth = originalTileWidth * Math.max(
            width / (imageObj?.width-originalTileWidth), 
            height / (imageObj?.height-(2*originalTileWidth)),
        )
    }

    onMount(()=>{
        ctx = canvas.getContext("2d")!
        person = loadAllFrames()
        imageObj = new Image();
        imageObj.src = base;
        imageObj.addEventListener("load",()=>{
            currTileWidth = originalTileWidth * Math.max(
                width / (imageObj.width-originalTileWidth), 
                height / (imageObj.height-(2*originalTileWidth)),
            )
            safe = true
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            tilesets = loadAllTiles()
            window.requestAnimationFrame((t)=>drawMap(t, ctx, currTileWidth))
        })
    })

    function drawPerson(
        pic: HTMLImageElement,
        frameCoords: coord,
        c: coord,
        env: {
            cameraX: number,
            cameraY: number,
            resizeFactor: number
        }
    ) {
        ctx.drawImage(
            pic, //img

            frameCoords[0]*32,  //
            frameCoords[1]*64, //starting copying point

            32,   //
            64, //copy size

            (c[0]*currTileWidth) - env.cameraX,          //
            ((c[1]+1)*currTileWidth) -           //
                64*env.resizeFactor - env.cameraY, //pasting point

            32*env.resizeFactor, //
            64*env.resizeFactor //paste size
        )
    }

    function drawTile(
        set: Tileset, 
        idx: number, 
        coords: coord,
        env: {
            cameraX: number,
            cameraY: number,
            resizeFactor: number
        }
    ) {
        const [startX, startY, tWidth, tHeight] = getData(
            set.size[idx - set.start]
        )
        const [x, y] = coords
        ctx.drawImage(
            set.data, //img

            startX,  //
            startY, //starting copying point

            tWidth,   //
            tHeight, //copy size

            (x*currTileWidth) - env.cameraX,          //
            ((y+1)*currTileWidth) -           //
                tHeight*env.resizeFactor - env.cameraY, //pasting point

            tWidth*env.resizeFactor, //
            tHeight*env.resizeFactor //paste size
        )
    }
    
    function drawMap(timestamp: number, ctx: CanvasRenderingContext2D, currWidth: number) {
        if (!safe) return;
        if (timestamp-lastTime < MIN_TIMESTEP) {
            window.requestAnimationFrame((t)=>drawMap(t, ctx, currTileWidth))
            return
        }
        let time = timestamp/MIN_TIMESTEP
        let resizeFactor = currWidth / originalTileWidth
        let cameraX = ((imageObj.width-originalTileWidth)*resizeFactor - width)/2
        let cameraY = ((imageObj.height-(originalTileWidth*2))*resizeFactor - height)/2
        let notDrawn = true;
        let env = {
            cameraX, cameraY, resizeFactor
        }

        ctx.drawImage(
            imageObj, //img
            originalTileWidth, 0, //starting copying point

            imageObj.width - originalTileWidth,         //
            imageObj.height - (originalTileWidth * 2), //copy size

            -cameraX,  //
            -cameraY, //pasting point

            (imageObj.width - originalTileWidth) * resizeFactor,   //
            (imageObj.height - (originalTileWidth * 2)) * resizeFactor  //paste size
        );

        (<(number|null)[][]>currMap).map((row, absY) => {
            row.map((_tile, absX) => {
                if (_tile != null && _tile !== -1) {
                    let idx = tilesets.findIndex(s => {
                        return s.start > _tile
                    })
                    const set = tilesets[(idx === -1? tilesets.length : idx) - 1]
                    if (set) {
                        drawTile(
                            set, 
                            _tile, 
                            [absX-1, absY],
                            env
                        )
                    }
                }
                if (Math.ceil(personCoords[0]-0.001) === absX-1 && 
                    Math.floor(personCoords[1]-0.001) === absY &&
                    notDrawn
                ){
                    drawPerson(...calcPerson(...personCoords, time), env)
                    notDrawn = false
                }
            })
        });

        lastTime = timestamp;
        window.requestAnimationFrame((t)=>drawMap(t, ctx, currTileWidth))
    }

    function calcPerson(
        x: number, y: number,
        time: number
    ): [HTMLImageElement, coord, coord] {
        let frames: coord[];
        let f: number;
        let oldCoords: coord;
        if (personSpeed[0] < 0){
            frames = person.walk.left[lastPlayed? 0 : 1]
            f = Math.floor(time-startAnim!);
            personCoords = [Math.ceil(x)-f/frames.length, y]
            oldCoords = [...personCoords]
            personSpeed[0] = -(frames.length - 1 - f);
            if (personSpeed[0] >= 0) {
                lastPlayed = lastPlayed? 0 : 1
                startAnim = undefined
                personSpeed = nextSpeed
                nextSpeed = [0,0]
                startAnim = performance.now()/MIN_TIMESTEP;
                personCoords = [Math.floor(x), y]
                prevSpeed = [-1, 0]
            }
        } else if (personSpeed[0] > 0){
            frames = person.walk.right[lastPlayed? 0 : 1]
            f = Math.floor(time-startAnim!);
            personCoords = [Math.floor(x)+f/frames.length, y]
            oldCoords = [...personCoords]
            personSpeed[0] = frames.length - 1 - f;
            if (personSpeed[0] <= 0) {
                lastPlayed = lastPlayed? 0 : 1
                startAnim = undefined
                personSpeed = nextSpeed
                nextSpeed = [0,0]
                startAnim = performance.now()/MIN_TIMESTEP;
                personCoords = [Math.ceil(x), y]
                prevSpeed = [1, 0]
            }
        } else if (personSpeed[1] < 0){
            frames = person.walk.up[lastPlayed? 0 : 1]
            f = Math.floor(time-startAnim!);
            personCoords = [x, Math.ceil(y)-f/frames.length]
            oldCoords = [...personCoords]
            personSpeed[1] = -(frames.length - 1 - f);
            if (personSpeed[1] >= 0) {
                lastPlayed = lastPlayed? 0 : 1
                startAnim = undefined
                personSpeed = nextSpeed
                nextSpeed = [0,0]
                startAnim = performance.now()/MIN_TIMESTEP;
                personCoords = [x, Math.floor(y)]
                prevSpeed = [0, -1]
            }
        } else if (personSpeed[1] > 0){
            frames = person.walk.down[lastPlayed? 0 : 1]
            f = Math.floor(time-startAnim!);
            personCoords = [x, Math.floor(y)+f/frames.length]
            oldCoords = [...personCoords]
            personSpeed[1] = frames.length - 1 - f;
            if (personSpeed[1] <= 0) {
                lastPlayed = lastPlayed? 0 : 1
                startAnim = undefined
                personSpeed = nextSpeed
                nextSpeed = [0,0]
                startAnim = performance.now()/MIN_TIMESTEP;
                personCoords = [x, Math.ceil(y)]
                prevSpeed = [0, 1]
            }
        } else {
            frames = prevSpeed[0] === 1 ? person.still.right :
                prevSpeed[0] === -1 ? person.still.left :
                prevSpeed[1] === -1 ? person.still.up : person.still.down
            f = Math.floor(time)%frames.length
            oldCoords = personCoords
        }

        return [
            person.pic,
            frames[Math.max(Math.min(f, frames.length - 1), 0)],
            oldCoords
        ]
    }

    function getData(tile: TileSize) {
        return [ 
            tile.start[0]*originalTileWidth, tile.start[1]*originalTileWidth,
            (tile.end? tile.end[0]-tile.start[0]+1: 1)*originalTileWidth,
            (tile.end? tile.end[1]-tile.start[1]+1: 1)*originalTileWidth,
        ]
    }
    
    function handleKeydown(e: KeyboardEvent) {
        if (
            (personSpeed[0] !== 0 || personSpeed[1] !== 0) //we're moving
        ) { 
            if ((e.code === "KeyW" || e.code === "ArrowUp")) {
                nextSpeed = [0, -person.walk.up.length]
            } else if ((e.code === "KeyA" || e.code === "ArrowLeft")) {
                nextSpeed = [-person.walk.left.length, 0]
            } else if ((e.code === "KeyS" || e.code === "ArrowDown")) {
                nextSpeed = [0, person.walk.down.length]
            } else if ((e.code === "KeyD" || e.code === "ArrowRight")) {
                nextSpeed = [person.walk.right.length, 0]
            } 
            return
        }
        if ((e.code === "KeyW" || e.code === "ArrowUp")) {
            personSpeed = [0, -person.walk.up.length]
            nextSpeed = [0, -person.walk.up.length]
        } else if ((e.code === "KeyA" || e.code === "ArrowLeft")) {
            personSpeed = [-person.walk.left.length, 0]
            nextSpeed = [-person.walk.left.length, 0]
        } else if ((e.code === "KeyS" || e.code === "ArrowDown")) {
            personSpeed = [0, person.walk.down.length]
            nextSpeed = [0, person.walk.down.length]
        } else if ((e.code === "KeyD" || e.code === "ArrowRight")) {
            personSpeed = [person.walk.right.length, 0]
            nextSpeed = [person.walk.right.length, 0]
        } else { return }
        startAnim = performance.now()/MIN_TIMESTEP;
    }

    function handleKeyup(e: KeyboardEvent) {
        if (
            (nextSpeed[0] !== 0 || nextSpeed[1] !== 0) //we're going to move
        ) { 
            if ((e.code === "KeyW" || e.code === "ArrowUp") && nextSpeed[1] < 0) {
                nextSpeed = [0, 0]
            } else if ((e.code === "KeyA" || e.code === "ArrowLeft") && nextSpeed[0] < 0) {
                nextSpeed = [0, 0]
            } else if ((e.code === "KeyS" || e.code === "ArrowDown") && nextSpeed[1] > 0) {
                nextSpeed = [0, 0]
            } else if ((e.code === "KeyD" || e.code === "ArrowRight") && nextSpeed[0] > 0) {
                nextSpeed = [0, 0]
            }
            return
        }
    }
</script>


<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup}/>
<div class="bg-game bg-center bg-cover" bind:clientHeight={height} bind:clientWidth={width} {style}>
    <canvas bind:this={canvas} {width} {height}></canvas>
</div>


<style>
	div {
        position: fixed;
        top: 0; left: 0;
		width: 100vw;
        height: 100vh;
		margin: 0;
        z-index: -1002;
	}
</style>