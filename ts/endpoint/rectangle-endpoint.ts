import {EndpointRepresentation} from "./endpoints";
import {ComputedAnchorPosition, Orientation} from "../factory/anchor-factory";
import {jsPlumbInstance} from "../core";
import {EndpointFactory} from "../factory/endpoint-factory";

export type ComputedRectangleEndpoint = [ number, number, number, number ];

export class RectangleEndpoint<E> extends EndpointRepresentation<E, ComputedRectangleEndpoint> {

    width:number;
    height:number;

    constructor(instance:jsPlumbInstance<E>, params?:any) {

        super(instance);

        params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;
    }

    _compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any):ComputedRectangleEndpoint {
        let width = endpointStyle.width || this.width,
            height = endpointStyle.height || this.height,
            x = anchorPoint[0] - (width / 2),
            y = anchorPoint[1] - (height / 2);

        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;

        return [ x, y, width, height];
    }

    getType(): string {
        return "Rectangle";
    }
}

EndpointFactory.register("Rectangle", RectangleEndpoint);

