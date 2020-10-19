import {CustomOverlayOptions, Overlay} from "./overlay"
import { JsPlumbInstance } from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'

export class CustomOverlay extends Overlay {

    create:(c:Component) => any

    constructor(public instance:JsPlumbInstance, public component:Component,
                p:CustomOverlayOptions) {

        super(instance, component, p)
        this.create = p.create
    }

    static customType = "Custom"
    type:string = CustomOverlay.customType

    updateFrom(d: any): void { }

}

export function isCustomOverlay(o:Overlay):o is CustomOverlay {
    return o.type === CustomOverlay.customType
}

OverlayFactory.register("Custom", CustomOverlay)
