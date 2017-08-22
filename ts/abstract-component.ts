export type Bounds =  { minX:number, minY:number, maxX:number, maxY:number };
export type Point = { x:number, y:number };

export abstract class AbstractComponent  {
    bounds:Bounds;
    resetBounds () {
        this.bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    };

    constructor() {
        this.resetBounds();
    }
}