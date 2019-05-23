import {EndpointRepresentation, Endpoints} from "./endpoints";
import {ComputedAnchorPosition, Orientation} from "../anchor/anchors";
import {PaintStyle} from "../styles";
import {jsPlumbInstance} from "../core";

export type ComputedBlankEndpoint = [ number, number, number, number  ];

export class BlankEndpoint<E> extends EndpointRepresentation<E, ComputedBlankEndpoint> {

    type = "Blank";

    constructor(instance:jsPlumbInstance<E>, params?:any) {

        super(instance);
    }

    _compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any):ComputedBlankEndpoint {
        return [anchorPoint[0], anchorPoint[1], 10, 0];
    }
}

Endpoints.register("Blank", BlankEndpoint);


