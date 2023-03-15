import sizes from "./sizes";
const images = import.meta.glob("../../../static/tiles/*.png");
import type { Tileset } from "./types"

export async function loadAllTiles(): Promise<Tileset[]>{
    let tilesets = []
    let idx = 0
        
    for (const img in images){  
        const set = await split(img, idx)    
        tilesets.push(set)
        idx = set.size.length
    }
    
    return tilesets
}

async function split(img: string, start: number): Promise<Tileset> {
    var imageObj = new Image();
    imageObj.src = img.slice("../../../static".length);
    const name = img.slice("../../../static/tiles/".length, -".png".length)  
    return new Promise(resolve=>{
        imageObj.addEventListener("load", ()=>{
            resolve({start, name, data: imageObj, size: sizes[name]})
        })
    });
}