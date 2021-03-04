import {EndpointRepresentation} from "./endpoints"
import {Orientation} from "../factory/anchor-factory"
import {Endpoint} from "./endpoint"
import {AnchorPlacement} from "../router/router"

export type ComputedRectangleEndpoint = [ number, number, number, number ]

export interface RectangleEndpointParams {
    width?:number
    height?:number
}

export class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {

    width:number
    height:number

    constructor(endpoint:Endpoint, params?:RectangleEndpointParams) {

        super(endpoint)

        params = params || {}
        this.width = params.width || 10
        this.height = params.height || 10
    }

    getParams(): Record<string, any> {
        return {
            width: this.width,
            height:this.height
        }
    }

    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    _compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):ComputedRectangleEndpoint {
        let width = endpointStyle.width || this.width,
            height = endpointStyle.height || this.height,
            x = anchorPoint[0] - (width / 2),
            y = anchorPoint[1] - (height / 2)

        this.x = x
        this.y = y
        this.w = width
        this.h = height

        return [ x, y, width, height]
    }

    static type= "Rectangle"
    getType(): string {
        return RectangleEndpoint.type
    }
}


