import {EndpointRepresentation} from "./endpoints";
import {ComputedAnchorPosition, Orientation} from "../factory/anchor-factory";
import {EndpointFactory} from "../factory/endpoint-factory";
import {Endpoint} from "./endpoint-impl";

export type ComputedDotEndpoint = [ number, number, number, number, number ];

export class DotEndpoint<E> extends EndpointRepresentation<ComputedDotEndpoint> {

    radius:number;
    defaultOffset:number;
    defaultInnerRadius:number;

    constructor(endpoint:Endpoint, params?:any) {
        
        super(endpoint);
        
        params = params || {};
        this.radius = params.radius || 5;
        this.defaultOffset = 0.5 * this.radius;
        this.defaultInnerRadius = this.radius / 3;
    }

    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    _compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any):ComputedDotEndpoint {
        //this.radius = endpointStyle.radius || this.radius;
        let x = anchorPoint[0] - this.radius,
            y = anchorPoint[1] - this.radius,
            w = this.radius * 2,
            h = this.radius * 2;

        if (endpointStyle && endpointStyle.stroke) {
            let lw = endpointStyle.strokeWidth || 1;
            x -= lw;
            y -= lw;
            w += (lw * 2);
            h += (lw * 2);
        }

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        return [ x, y, w, h, this.radius ];
    }


    getType(): string {
        return "Dot";
    }
}

EndpointFactory.register("Dot", DotEndpoint);
