import {EndpointRepresentation, Endpoints} from "./endpoints";
import {ComputedAnchorPosition, Orientation} from "../anchor/anchors";
import {PaintStyle} from "../styles";
import {jsPlumbInstance} from "../core";

export type ComputedRectangleEndpoint = [ number, number, number, number ];

export class RectangleEndpoint<E> extends EndpointRepresentation<E, ComputedRectangleEndpoint> {

    type = "Rectangle";

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

        return [ x, y, width, height];
    }
}

Endpoints.register("Rectangle", RectangleEndpoint);

