import {Overlay} from "./overlay"
import { JsPlumbInstance } from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import { CustomOverlayOptions } from "@jsplumb/common"

export class CustomOverlay extends Overlay {

    create:(c:Component) => any

    constructor(public instance:JsPlumbInstance, public component:Component,
                p:CustomOverlayOptions) {

        super(instance, component, p)
        this.create = p.create
    }

    static type = "Custom"
    type:string = CustomOverlay.type

    updateFrom(d: any): void { }

}

export function isCustomOverlay(o:Overlay):o is CustomOverlay {
    return o.type === CustomOverlay.type
}

OverlayFactory.register("Custom", CustomOverlay)
