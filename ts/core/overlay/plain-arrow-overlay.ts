import {ArrowOverlay} from "./arrow-overlay"
import {JsPlumbInstance} from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import { Overlay } from "./overlay"
import {ArrowOverlayOptions} from "../../common/overlay"

export class PlainArrowOverlay extends ArrowOverlay {

    static type = "PlainArrow"
    type:string = PlainArrowOverlay.type

    constructor(public instance:JsPlumbInstance, component: Component, p: ArrowOverlayOptions) {
        super(instance, component, p)
        this.foldback = 1
    }
}

export function isPlainArrowOverlay(o:Overlay):o is PlainArrowOverlay {
    return o.type === PlainArrowOverlay.type
}

OverlayFactory.register("PlainArrow", PlainArrowOverlay)
