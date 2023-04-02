import {ArrowOverlay} from "./arrow-overlay"
import {JsPlumbInstance} from "../core"
import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import {Overlay} from "./overlay"
import {ArrowOverlayOptions} from "../../common/overlay"

export class DiamondOverlay extends ArrowOverlay {

    static type = "Diamond"
    type:string = DiamondOverlay.type

    constructor(public instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions) {
        super(instance, component, p)

        this.length = this.length / 2
        this.foldback = 2
    }
}

export function isDiamondOverlay(o:Overlay):o is DiamondOverlay {
    return o.type === DiamondOverlay.type
}

OverlayFactory.register(DiamondOverlay.type, DiamondOverlay)
