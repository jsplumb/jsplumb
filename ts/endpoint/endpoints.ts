import {jsPlumbInstance} from "../core";
import {ComputedAnchorPosition, Orientation} from "../factory/anchor-factory";
import {PaintStyle} from "../styles";
import {EndpointRenderer} from "./endpoint-renderer";
import {EMPTY_BOUNDS, SegmentBounds} from "../connector/abstract-segment";

/**
 * Superclass for all types of Endpoint. This class is renderer
 * agnostic, as are any subclasses of it.
 */
export abstract class EndpointRepresentation<E, C> {

    typeId:string;

    renderer:EndpointRenderer<E>;

    x:number;
    y:number;
    w:number;
    h:number;

    computedValue:C;

    bounds:SegmentBounds = EMPTY_BOUNDS;

    abstract getType():string;
    abstract _compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any):C;

    constructor(protected instance:jsPlumbInstance<E>) {
        this.renderer = instance.renderer.assignRenderer(instance, this);
    }

    paint(paintStyle:PaintStyle) {
        this.renderer.paint(paintStyle);
    }

    clone():EndpointRepresentation<E, C> {
        return null;
    }

    cleanup(force?:boolean) {
        this.renderer.cleanup(force);
    }

    destroy(force?:boolean) {
        this.renderer.destroy(force);
    }

    setHover(h:boolean) {
        this.renderer.setHover(h);
    }

    compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any) {
        this.computedValue = this._compute(anchorPoint, orientation, endpointStyle);
        this.bounds.minX = this.x;
        this.bounds.minY = this.y;
        this.bounds.maxX = this.x + this.w;
        this.bounds.maxY = this.y + this.h;
    }
}




