import { JsPlumbInstance } from "../core"
import {Orientation} from "../factory/anchor-factory"
import {EMPTY_BOUNDS} from "../connector/abstract-segment"
import {Endpoint} from "./endpoint"
import {AnchorPlacement} from "../router/router"
import {Extents} from "@jsplumb/core"

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
    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    abstract _compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):C

    /**
     * Subclasses must implement this for the clone functionality: they return an object containing the type specific
     * constructor values for the given endpoint.
     */
    abstract getParams():Record<string, any>

    protected constructor(public endpoint:Endpoint) {
        this.instance = endpoint.instance
        if (endpoint.cssClass) {
            this.classes.push(endpoint.cssClass)
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
        // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
        // it would be much more lightweight as we'd not need to create a class for each one.
        this.computedValue = this._compute(anchorPoint, orientation, endpointStyle)
        this.bounds.xmin = this.x
        this.bounds.ymin = this.y
        this.bounds.xmax = this.x + this.w
        this.bounds.ymax = this.y + this.h
    }

    setVisible(v:boolean){
        this.instance.setEndpointVisible(this.endpoint, v)
    }
}




