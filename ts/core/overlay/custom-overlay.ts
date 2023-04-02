import {Overlay} from "./overlay"
import { JsPlumbInstance } from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import {OverlayOptions} from "../../common/overlay"

/**
 * @public
 */
export interface CustomOverlayOptions extends OverlayOptions {
    create:(c:Component) => any
}

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

OverlayFactory.register(CustomOverlay.type, CustomOverlay)
