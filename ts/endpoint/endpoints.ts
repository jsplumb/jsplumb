import {jsPlumbInstance, TypeDescriptor} from "../core";
import {ComputedAnchorPosition, Orientation} from "../factory/anchor-factory";
import {PaintStyle} from "../styles";
import {EndpointRenderer} from "./endpoint-renderer";
import {EMPTY_BOUNDS, SegmentBounds} from "../connector/abstract-segment";
import {Endpoint} from "./endpoint-impl";

/**
 * Superclass for all types of Endpoint. This class is renderer
 * agnostic, as are any subclasses of it.
 */
export abstract class EndpointRepresentation<E, C> {

    typeId:string;

    x:number;
    y:number;
    w:number;
    h:number;

    computedValue:C;

    bounds:SegmentBounds = EMPTY_BOUNDS();

    classes:Array<string> = [];

    instance:jsPlumbInstance<E>;

    abstract getType():string;
    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    abstract _compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any):C;

    constructor(public endpoint:Endpoint<E>) {
        this.instance = endpoint.instance;

        if (endpoint.cssClass) {
            this.classes.push(endpoint.cssClass);
        }
    }

    addClass(c:string) {
        this.classes.push(c);
        this.instance.renderer.addEndpointClass(this, c);
    }

    removeClass(c:string) {
        this.classes = this.classes.filter((_c:string) => _c !== c);
        this.instance.renderer.removeEndpointClass(this, c);
    }

    paint(paintStyle:PaintStyle) {
        this.instance.renderer.paintEndpoint(this, paintStyle);
    }

    clone():EndpointRepresentation<E, C> {
        return null;
    }

    setHover(h:boolean) {
        this.instance.renderer.setEndpointHover(this, h);
    }

    compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any) {
        // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
        // it would be much more lightweight as we'd not need to create a class for each one.
        this.computedValue = this._compute(anchorPoint, orientation, endpointStyle);
        this.bounds.minX = this.x;
        this.bounds.minY = this.y;
        this.bounds.maxX = this.x + this.w;
        this.bounds.maxY = this.y + this.h;
    }

    applyType(t:TypeDescriptor) {
        this.instance.renderer.applyEndpointType(this, t);
    }

    setVisible(v:boolean){
        this.instance.renderer.setEndpointVisible(this, v);
    }
}




