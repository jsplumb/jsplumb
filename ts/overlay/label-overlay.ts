
import {LabelOverlayOptions, Overlay} from "./overlay";
import {isFunction} from "../util";
import {Component} from "../component/component";
import {jsPlumbInstance, PointArray} from "../core";
import {OverlayFactory} from "../factory/overlay-factory";

export class LabelOverlay extends Overlay {

    label:string | Function;
    labelText:string;

    type:string = "Label";

    cachedDimensions:PointArray;

    constructor(public instance:jsPlumbInstance, public component:Component,
                p:LabelOverlayOptions) {

        super(instance, component, p);
        p = p || { label:""};
        this.setLabel(p.label);
    }

    getLabel(): string {
        if (isFunction(this.label)) {
            return (this.label as Function)(this);
        } else {
            return this.labelText;
        }
    }

    setLabel(l: string | Function): void {
        this.label = l;
        this.labelText = null;
        this.instance.renderer.updateLabel(this);
    }

    getDimensions():PointArray { return [1,1];}


    updateFrom(d: any): void {
        if(d.label != null){
            this.setLabel(d.label);
        }
    }
}


OverlayFactory.register("Label", LabelOverlay);
