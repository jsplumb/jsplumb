import { JsPlumbInstance } from "../core"
import {Orientation} from "../factory/anchor-record-factory"
import {EMPTY_BOUNDS} from "../connector/abstract-segment"
import {Endpoint} from "./endpoint"
import {AnchorPlacement} from "../router/router"
import {EndpointFactory} from "../factory/endpoint-factory"
import { Extents } from '@jsplumb/util'

export interface EndpointRepresentationParams {
    cssClass?:string
}

/**
 * Superclass for all types of Endpoint. This class is renderer
 * agnostic, as are any subclasses of it.
 */
export abstract class EndpointRepresentation<C> {

    typeId:string

    x:number
    y:number
    w:number
    h:number

    computedValue:C

    bounds:Extents = EMPTY_BOUNDS()

    classes:Array<string> = []

    instance:JsPlumbInstance

    abstract type:string

    protected constructor(public endpoint:Endpoint, params?:EndpointRepresentationParams) {
        params = params || {}
        this.instance = endpoint.instance
        if (endpoint.cssClass) {
            this.classes.push(endpoint.cssClass)
        }
        if (params.cssClass) {
            this.classes.push(params.cssClass)
        }
    }

    addClass(c:string) {
        this.classes.push(c)
        this.instance.addEndpointClass(this.endpoint, c)
    }

    removeClass(c:string) {
        this.classes = this.classes.filter((_c:string) => _c !== c)
        this.instance.removeEndpointClass(this.endpoint, c)
    }

    compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any) {
        this.computedValue = EndpointFactory.compute(this, anchorPoint, orientation, endpointStyle)
        this.bounds.xmin = this.x
        this.bounds.ymin = this.y
        this.bounds.xmax = this.x + this.w
        this.bounds.ymax = this.y + this.h
    }

    setVisible(v:boolean){
        this.instance.setEndpointVisible(this.endpoint, v)
    }

}




