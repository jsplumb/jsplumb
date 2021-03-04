import {EndpointRepresentation} from "./endpoints"
import {Orientation} from "../factory/anchor-factory"
import {Endpoint} from "./endpoint"
import {AnchorPlacement} from "../router/router"

export type ComputedBlankEndpoint = [ number, number, number, number  ]

export interface BlankEndpointParams {}

export class BlankEndpoint extends EndpointRepresentation<ComputedBlankEndpoint> {

    constructor(endpoint:Endpoint, params?:BlankEndpointParams) {
        super(endpoint)
    }

    getParams(): Record<string, any> {
        return {}
    }

    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    _compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):ComputedBlankEndpoint {

        this.x = anchorPoint[0]
        this.y = anchorPoint[1]
        this.w = 10
        this.h = 0

        return [anchorPoint[0], anchorPoint[1], 10, 0]
    }

    static type = "Blank"
    getType(): string {
        return BlankEndpoint.type
    }
}



