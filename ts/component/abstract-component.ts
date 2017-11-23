export type Bounds =  { minX:number, minY:number, maxX:number, maxY:number };

/**
 * Base class for the UI renderer classes for Endpoints and Connectors
 */
export abstract class AbstractComponent {

    bounds:Bounds;
    x:number;
    y:number;
    w:number;
    h:number;

    constructor() {
        this.resetBounds();
    }

    resetBounds () {
        this.bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    }

    abstract compute(anchorPoint:any, orientation:any, endpointStyle:any, connectorPaintStyle:any):any;
}
