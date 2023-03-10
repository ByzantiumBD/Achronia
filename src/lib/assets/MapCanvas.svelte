<script lang="ts">
    import base from "./base.png"
	import { onMount } from "svelte";
	import type { coord, Tileset, TileSize } from "./types";
    import currMap from "./map.json"
	import { loadAllTiles } from "./loadtiles";

    export let style: string = "";
    let originalTileWidth = 32;
    let tilesets: Tileset[];
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let currTileWidth: number, width: number, height: number;
    let imageObj: HTMLImageElement;
    let safe = false

    $: (
        currTileWidth = originalTileWidth * Math.max(
            width / (imageObj?.width-originalTileWidth), 
            height / (imageObj?.height-(2*originalTileWidth)),
        )
    )

    $: setTimeout(()=>drawMap(ctx, currTileWidth), 500)

    onMount(()=>{
        ctx = canvas.getContext("2d")!
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
            drawMap(ctx, currTileWidth)
            setTimeout(() => {
                drawMap(ctx, currTileWidth)
            }, 150);
        })
    })
    
    function drawMap(ctx: CanvasRenderingContext2D, currWidth: number) {
        if (!safe) return;
        let resizeFactor = currWidth / originalTileWidth
        let currentX = ((imageObj.width-originalTileWidth)*resizeFactor - width)/2
        let currentY = ((imageObj.height-(originalTileWidth*2))*resizeFactor - height)/2
        
        ctx.drawImage(
            imageObj, //img
            originalTileWidth, 0, //starting copying point

            imageObj.width - originalTileWidth,         //
            imageObj.height - (originalTileWidth * 2), //copy size

            -currentX,  //
            -currentY, //pasting point

            (imageObj.width - originalTileWidth) * resizeFactor,   //
            (imageObj.height - (originalTileWidth * 2)) * resizeFactor  //paste size
        );
        (<(number|null)[][]>currMap).map((row, absY) => {
            row.map((_tile, absX) => {
                if (_tile == null || _tile === -1) return
                let idx = tilesets.findIndex(s => {
                    return s.start > _tile
                })
                const set = tilesets[(idx === -1? tilesets.length : idx) - 1]
                if (set) {
                    drawTile(
                        set, 
                        _tile, 
                        [absX, absY], 
                        [currentX+currWidth, currentY],
                        ctx, resizeFactor
                    )
                }
            })
        })
    }

    function drawTile(
        set: Tileset, 
        idx: number, 
        coords: coord, 
        camCoords: coord, 
        ctx: CanvasRenderingContext2D,
        resizeFactor: number
    ) {
        const [startX, startY, tWidth, tHeight] = getData(
            set.size[idx - set.start]
        )
        const [x, y, camX, camY] = [...coords, ...camCoords]
        ctx.drawImage(
            set.data, //img

            startX,  //
            startY, //starting copying point

            tWidth,   //
            tHeight, //copy size

            (x*currTileWidth) - camX,          //
            ((y+1)*currTileWidth) -           //
                tHeight*resizeFactor - camY, //pasting point

            tWidth*resizeFactor, //
            tHeight*resizeFactor //paste size
        )
    }

    function getData(tile: TileSize) {
        return [ 
            tile.start[0]*originalTileWidth, tile.start[1]*originalTileWidth,
            (tile.end? tile.end[0]-tile.start[0]+1: 1)*originalTileWidth,
            (tile.end? tile.end[1]-tile.start[1]+1: 1)*originalTileWidth,
        ]
    }
</script>

<div class="bg-game" bind:clientHeight={height} bind:clientWidth={width} {style}>
    <canvas bind:this={canvas} {width} {height}></canvas>
</div>


<style>
	div {
        position: fixed;
        top: 0; left: 0;
		width: 100vw;
        height: 100vh;
		margin: 0;
        z-index: -2;
	}
</style>