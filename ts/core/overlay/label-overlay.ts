
import { Overlay} from "./overlay"
import {Component} from "../component/component"
import {JsPlumbInstance} from "../core"
import {OverlayFactory} from "../factory/overlay-factory"
import {isFunction, Size} from "../../util/util"
import {LabelOverlayOptions} from "../../common/overlay"

export class LabelOverlay extends Overlay {

    label:string | Function
    labelText:string

    static type = "Label"
    type:string = LabelOverlay.type

    cachedDimensions:Size

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
        this.instance.updateLabel(this)
    }

    getDimensions():Size { return {w:1,h:1} }

    updateFrom(d: any): void {
        if(d.label != null){
            this.setLabel(d.label)
        }
        if (d.location != null) {
            this.setLocation(d.location)
            this.instance.updateLabel(this)
        }
    }
}

export function isLabelOverlay(o:Overlay):o is LabelOverlay {
    return o.type === LabelOverlay.type
}


OverlayFactory.register(LabelOverlay.type, LabelOverlay)
