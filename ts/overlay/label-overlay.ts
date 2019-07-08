
import {LabelOverlayOptions, Overlay} from "./overlay";
import {isFunction} from "../util";
import {Component} from "../component/component";
import {PaintStyle} from "../styles";
import {jsPlumbInstance, PointArray} from "../core";
import {LabelOverlayRenderer} from "./overlay-renderer";
import {OverlayFactory} from "../factory/overlay-factory";

export class LabelOverlay<E> extends Overlay<E> {

    label:string | Function;
    labelText:string;

    type:string = "Label";

    cachedDimensions:PointArray;

    constructor(protected instance:jsPlumbInstance<E>, public component:Component<E>,
                p:LabelOverlayOptions) {

        super(instance, component, p);
        p = p || { label:""};
        this.renderer = this.instance.renderer.assignOverlayRenderer(this.instance, this);
        this.setLabel(p.label);
    }

    getLabel(): string {
        return this.labelText;
    }

    setLabel(l: string | Function): void {
        this.label = l;
        this.labelText = null;
        this.update();
    }

    private _getDimensions(forceRefresh?:boolean):PointArray {
        if (this.cachedDimensions == null || forceRefresh) {
            this.cachedDimensions = this.getDimensions();
        }
        return this.cachedDimensions;
    }

    getDimensions():PointArray { return [1,1];}

    draw(component:Component<HTMLElement>, currentConnectionPaintStyle:PaintStyle, absolutePosition?:PointArray): any {
        return this.renderer.draw(component, currentConnectionPaintStyle, absolutePosition);
    }

    updateFrom(d: any): void {
        if(d.label != null){
            this.setLabel(d.label);
        }
    }

    update():void {
        if (isFunction(this.label)) {
            let lt = (this.label as Function)(this);
            if (lt != null) {
                (this.renderer as LabelOverlayRenderer<E>).setText(lt.replace(/\r\n/g, "<br/>"));
            } else {
                (this.renderer as LabelOverlayRenderer<E>).setText("");
            }

        }
        else {
            if (this.labelText == null) {
                this.labelText = this.label as string;
                if (this.labelText != null) {
                    (this.renderer as LabelOverlayRenderer<E>).setText(this.labelText.replace(/\r\n/g, "<br/>"));
                } else {
                    (this.renderer as LabelOverlayRenderer<E>).setText("");
                }

            }
        }
    }
}


OverlayFactory.register("Label", LabelOverlay);