import {EndpointRepresentation } from "./endpoints"
import {Orientation} from "../factory/anchor-record-factory"
import {Endpoint} from "./endpoint"
import {EndpointHandler} from "../factory/endpoint-factory"
import {AnchorPlacement} from "../../common/anchor"
import {DotEndpointParams} from "../../common/endpoint"

export type ComputedDotEndpoint = [ number, number, number, number, number ]

export class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {

    radius:number
    defaultOffset:number
    defaultInnerRadius:number

    constructor(endpoint:Endpoint, params?:DotEndpointParams) {
        
        super(endpoint, params)
        
        params = params || {}
        this.radius = params.radius || 5
        this.defaultOffset = 0.5 * this.radius
        this.defaultInnerRadius = this.radius / 3
    }

    static type = "Dot"
    type = DotEndpoint.type
}


export const DotEndpointHandler:EndpointHandler<DotEndpoint, ComputedDotEndpoint> = {

    type:DotEndpoint.type,

    cls:DotEndpoint,

    compute:(ep:DotEndpoint, anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):ComputedDotEndpoint => {
        let x = anchorPoint.curX - ep.radius,
            y = anchorPoint.curY - ep.radius,
            w = ep.radius * 2,
            h = ep.radius * 2

        if (endpointStyle && endpointStyle.stroke) {
            let lw = endpointStyle.strokeWidth || 1
            x -= lw
            y -= lw
            w += (lw * 2)
            h += (lw * 2)
        }

        ep.x = x
        ep.y = y
        ep.w = w
        ep.h = h

        return [ x, y, w, h, ep.radius ]
    },

    getParams:(ep:DotEndpoint): Record<string, any> => {
        return { radius: ep.radius }
    }
}
