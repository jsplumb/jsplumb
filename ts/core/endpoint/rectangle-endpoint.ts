import {EndpointRepresentation} from "./endpoints"
import {Orientation} from "../factory/anchor-record-factory"
import {Endpoint} from "./endpoint"
import {EndpointHandler} from "../factory/endpoint-factory"
import {AnchorPlacement} from "../../common/anchor"
import {RectangleEndpointParams} from "../../common/endpoint"

export type ComputedRectangleEndpoint = [ number, number, number, number ]

export class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {

    width:number
    height:number

    constructor(endpoint:Endpoint, params?:RectangleEndpointParams) {

        super(endpoint, params)

        params = params || {}
        this.width = params.width || 10
        this.height = params.height || 10
    }

    static type = "Rectangle"
    type = RectangleEndpoint.type

    static _getParams(ep:RectangleEndpoint):Record<string, any> {
        return {
            width: ep.width,
            height:ep.height
        }
    }
}

export const RectangleEndpointHandler:EndpointHandler<RectangleEndpoint, ComputedRectangleEndpoint> = {

    type:RectangleEndpoint.type,

    cls:RectangleEndpoint,

    compute:(ep:RectangleEndpoint, anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):ComputedRectangleEndpoint => {
        let width = endpointStyle.width || ep.width,
            height = endpointStyle.height || ep.height,
            x = anchorPoint.curX - (width / 2),
            y = anchorPoint.curY - (height / 2)

        ep.x = x
        ep.y = y
        ep.w = width
        ep.h = height

        return [ x, y, width, height]
    },

    getParams:(ep:RectangleEndpoint):Record<string, any> => {
        return {
            width: ep.width,
            height:ep.height
        }
    }
}


