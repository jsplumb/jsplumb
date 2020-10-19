import {EndpointRepresentation} from "./endpoints"
import {Orientation} from "../factory/anchor-factory"
import {EndpointFactory} from "../factory/endpoint-factory"
import {Endpoint} from "./endpoint-impl"
import {AnchorPlacement} from "../anchor-manager"

export type ComputedBlankEndpoint = [ number, number, number, number  ]

export class BlankEndpoint<E> extends EndpointRepresentation<ComputedBlankEndpoint> {

    constructor(endpoint:Endpoint, params?:any) {
        super(endpoint)
    }

    //
    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    _compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):ComputedBlankEndpoint {

        this.x = anchorPoint[0]
        this.y = anchorPoint[1]
        this.w = 10
        this.h = 0

        return [anchorPoint[0], anchorPoint[1], 10, 0]
    }

    getType(): string {
        return "Blank"
    }
}

EndpointFactory.register("Blank", BlankEndpoint)


