
import {JsPlumbInstance} from "../core"
import {Component} from "../component/component"
import {isString, uuid, EventGenerator} from "@jsplumb/util"
import {OverlaySpec, FullOverlaySpec, OverlayOptions} from "@jsplumb/common"


/**
 * Returns whether or not the given overlay spec is a 'full' overlay spec, ie. has a `type` and some `options`, or is just an overlay name.
 * @param o
 */
export function isFullOverlaySpec(o:OverlaySpec):o is FullOverlaySpec {
    return (o as any).type != null && (o as any).options != null
}

/**
 * Convert the given input into an object in the form of a `FullOverlaySpec`
 * @param spec
 */
export function convertToFullOverlaySpec(spec:string | OverlaySpec):FullOverlaySpec {
    let o:FullOverlaySpec = null
    if (isString(spec)) {
        o = { type:spec as string, options:{ } }
    } else {
        o = spec as FullOverlaySpec
    }
    o.options.id = o.options.id || uuid()
    return o
}

export abstract class Overlay extends EventGenerator {

    id:string
    abstract type:string

    cssClass:string

    visible:boolean = true
    location: number | Array<number>

    events:Record<string, (value:any, event?:any)=>any>
    attributes:Record<string, string>

    constructor(public instance:JsPlumbInstance, public component:Component, p:OverlayOptions) {
        super()
        p = p || {}
        this.id = p.id  || uuid()
        this.cssClass = p.cssClass || ""
        this.location = p.location || 0.5
        this.events = p.events || {}
        this.attributes = p.attributes || {}

        for (let event in this.events) {
            this.bind(event, this.events[event])
        }
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
    }

    setVisible(v: boolean): void {
        this.visible = v
        this.instance.setOverlayVisible(this, v)
    }

    isVisible(): boolean {
        return this.visible
    }

    abstract updateFrom(d:any):void

}


export interface OverlayMouseEventParams {
    e:Event
    overlay:Overlay
}




