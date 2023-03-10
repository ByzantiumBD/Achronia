import sizes from "./sizes";
const images = import.meta.glob("../../../static/tiles/*.png");
import type { Tileset } from "./types"

export function loadAllTiles(): Tileset[]{
    let tilesets = []
    let idx = 0
        
    for (const img in images){  
        const set = split(img, idx)    
        tilesets.push(set)
        idx = set.size.length
    }
    
    return tilesets
}

function split(img: string, start: number): Tileset {
    var imageObj = new Image();
    imageObj.src = img.slice("../../../static".length);    
    const name = img.slice("../../../static/tiles/".length, -".png".length)  
    return {start, name, data: imageObj, size: sizes[name]}
}