import {EndpointRepresentation} from "./endpoints";
import {ComputedAnchorPosition, Orientation} from "../factory/anchor-factory";
import {EndpointFactory} from "../factory/endpoint-factory";
import {Endpoint} from "./endpoint-impl";

export type ComputedRectangleEndpoint = [ number, number, number, number ];

export class RectangleEndpoint<E> extends EndpointRepresentation<ComputedRectangleEndpoint> {

    width:number;
    height:number;

    constructor(endpoint:Endpoint, params?:any) {

        super(endpoint);

        params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;
    }

    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
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

