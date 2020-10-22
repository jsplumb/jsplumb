import {ArrowOverlay} from "./arrow-overlay"
import {JsPlumbInstance} from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import {ArrowOverlayOptions, Overlay} from "../overlay/overlay"

export class PlainArrowOverlay extends ArrowOverlay {

    static arrowType = "PlainArrow"
    type:string = PlainArrowOverlay.arrowType

    constructor(public instance:JsPlumbInstance, component: Component, p: ArrowOverlayOptions) {
        super(instance, component, p)
        this.foldback = 1
    }
}

export function isPlainArrowOverlay(o:Overlay):o is PlainArrowOverlay {
    return o.type === PlainArrowOverlay.arrowType
}

OverlayFactory.register("PlainArrow", PlainArrowOverlay)
