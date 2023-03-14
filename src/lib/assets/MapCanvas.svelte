<script lang="ts">
    import base from "./base.png"
	import { onDestroy, onMount } from "svelte";
	import type { Tileset } from "./types";
	import { loadAllTiles } from "./loadtiles";
    import * as game from "./game"

    let originalTileWidth = 32;
    let tilesets: Tileset[];
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let currTileWidth: number, width: number, height: number;
    let imageObj: HTMLImageElement;

    $: {
        currTileWidth = Math.round(originalTileWidth * Math.max(
            width / (imageObj?.width-originalTileWidth), 
            height / (imageObj?.height-(2*originalTileWidth)),
        ));
        game.handleResize(currTileWidth)
        if (canvas) canvas.width = width
    }

    function loop(tstamp: number) {
        game.drawMap(tstamp)
        window.requestAnimationFrame(loop)
    }

    onMount(()=>{
        ctx = canvas.getContext("2d", {alpha:false})!
        imageObj = new Image();
        imageObj.src = base;
        imageObj.addEventListener("load", async ()=>{
            currTileWidth = originalTileWidth * Math.max(
                width / (imageObj.width-originalTileWidth), 
                height / (imageObj.height-(2*originalTileWidth)),
            )
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            tilesets = await loadAllTiles()
            game.setup(imageObj, ctx, tilesets)
            game.handleResize(currTileWidth)
            window.requestAnimationFrame(loop)
        })
    })
</script>


<svelte:window on:keydown={game.handleKeydown} on:keyup={game.handleKeyup}/>
<div class="bg-game bg-center bg-cover" style="left:{-Math.round(currTileWidth)}px;" bind:clientHeight={height} bind:clientWidth={width}>
    <canvas bind:this={canvas} {width} {height}></canvas>
</div>


<style>
	div {
        position: fixed;
        top: 0; right: 0;
        height: 100vh;
		margin: 0;
        z-index: -1002;
	}
</style>