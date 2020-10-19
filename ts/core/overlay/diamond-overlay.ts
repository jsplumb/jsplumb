import {ArrowOverlay} from "./arrow-overlay"
import {JsPlumbInstance} from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import {ArrowOverlayOptions, Overlay} from "../overlay/overlay"

export class DiamondOverlay extends ArrowOverlay {

    static arrowType = "Diamond"
    type:string = DiamondOverlay.arrowType

    constructor(public instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions) {
        super(instance, component, p)

        this.length = this.length / 2
        this.foldback = 2
    }
}

export function isDiamondOverlay(o:Overlay):o is DiamondOverlay {
    return o.type === DiamondOverlay.arrowType
}

OverlayFactory.register("Diamond", DiamondOverlay)
