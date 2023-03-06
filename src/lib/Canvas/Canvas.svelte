<script lang="ts">
	import { onMount } from 'svelte';
    import { base } from "$app/paths"
    export let canvClass = "";
    let canvas: HTMLCanvasElement;
    onMount(()=>{
		const ctx = canvas.getContext('2d')!!;
		
        var imageObj = new Image();
        imageObj.src = `${base}/tileset.png`;

        imageObj.onload = function() {
            ctx.drawImage(imageObj, 0, 0);
            const tileSize = 32
            var tilesX = 320 / tileSize;
            var tilesY = 160 / tileSize;      
            var tileData = new Array();
            for(var i=0; i<tilesY; i++) {
                for(var j=0; j<tilesX; j++) {           
                    // Store the image data of each tile in the array.
                    tileData.push(ctx.getImageData(j*tileSize, i*tileSize, tileSize, tileSize));
                }
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            //From here you should be able to draw your images back into a canvas like so:
            ctx.putImageData(tileData[0], 32, 32);
            console.log(tileData)
        }
    })
</script>

<canvas class={canvClass} bind:this={canvas}/>