
import {LabelOverlayOptions, Overlay} from "./overlay"
import {isFunction} from "../util"
import {Component} from "../component/component"
import {JsPlumbInstance} from "../core"
import {OverlayFactory} from "../factory/overlay-factory"
import { PointArray } from '../common'

export class LabelOverlay extends Overlay {

    label:string | Function
    labelText:string

    static labelType = "Label"
    type:string = LabelOverlay.labelType

    cachedDimensions:PointArray

    constructor(public instance:JsPlumbInstance, public component:Component,
                p:LabelOverlayOptions) {

        super(instance, component, p)
        p = p || { label:""}
        this.setLabel(p.label)
    }

    getLabel(): string {
        if (isFunction(this.label)) {
            return (this.label as Function)(this)
        } else {
            return this.labelText
        }
    }

    setLabel(l: string | Function): void {
        this.label = l
        this.labelText = null
        this.instance.renderer.updateLabel(this)
    }

    getDimensions():PointArray { return [1,1];}


    updateFrom(d: any): void {
        if(d.label != null){
            this.setLabel(d.label)
        }
    }
}

export function isLabelOverlay(o:Overlay):o is LabelOverlay {
    return o.type === LabelOverlay.labelType
}


OverlayFactory.register("Label", LabelOverlay)
