import { JsPlumbInstance } from "../core"
import {Orientation} from "../factory/anchor-factory"
//import {PaintStyle} from "../styles"
import {EMPTY_BOUNDS, SegmentBounds} from "../connector/abstract-segment"
import {Endpoint} from "./endpoint-impl"
import {AnchorPlacement} from "../anchor-manager"

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

    bounds:SegmentBounds = EMPTY_BOUNDS()

    classes:Array<string> = []

    instance:JsPlumbInstance

    abstract getType():string
    // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
    // it would be much more lightweight as we'd not need to create a class for each one.
    abstract _compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):C

    constructor(public endpoint:Endpoint) {
        this.instance = endpoint.instance

        if (endpoint.cssClass) {
            this.classes.push(endpoint.cssClass)
        }
    }

    addClass(c:string) {
        this.classes.push(c)
        this.instance.renderer.addEndpointClass(this.endpoint, c)
    }

    removeClass(c:string) {
        this.classes = this.classes.filter((_c:string) => _c !== c)
        this.instance.renderer.removeEndpointClass(this.endpoint, c)
    }

    clone():EndpointRepresentation<C> {
        return null
    }

    compute(anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any) {
        // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
        // it would be much more lightweight as we'd not need to create a class for each one.
        this.computedValue = this._compute(anchorPoint, orientation, endpointStyle)
        this.bounds.minX = this.x
        this.bounds.minY = this.y
        this.bounds.maxX = this.x + this.w
        this.bounds.maxY = this.y + this.h
    }

    setVisible(v:boolean){
        this.instance.renderer.setEndpointVisible(this.endpoint, v)
    }
}




