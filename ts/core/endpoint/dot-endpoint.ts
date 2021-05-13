import {EndpointRepresentation} from "./endpoints"
import {Orientation} from "../factory/anchor-record-factory"
import {Endpoint} from "./endpoint"
import {AnchorPlacement} from "../router/router"

export type ComputedDotEndpoint = [ number, number, number, number, number ]

export interface DotEndpointParams {
    radius?:number
}

export class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {

    radius:number
    defaultOffset:number
    defaultInnerRadius:number

    constructor(endpoint:Endpoint, params?:DotEndpointParams) {
        
        super(endpoint)
        
        params = params || {}
        this.radius = params.radius || 5
        this.defaultOffset = 0.5 * this.radius
        this.defaultInnerRadius = this.radius / 3
    }

    getParams(): Record<string, any> {
        return { radius: this.radius }
    }

    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    _compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):ComputedDotEndpoint {
        //this.radius = endpointStyle.radius || this.radius
        let x = anchorPoint.curX - this.radius,
            y = anchorPoint.curY - this.radius,
            w = this.radius * 2,
            h = this.radius * 2

        if (endpointStyle && endpointStyle.stroke) {
            let lw = endpointStyle.strokeWidth || 1
            x -= lw
            y -= lw
            w += (lw * 2)
            h += (lw * 2)
        }

        this.x = x
        this.y = y
        this.w = w
        this.h = h

        return [ x, y, w, h, this.radius ]
    }

    static type = "Dot"
    type = DotEndpoint.type
}

