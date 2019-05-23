
import {Overlay, Overlays} from "../overlay";
import {isFunction, uuid} from "../util";
import {Component} from "../component/component";
import {PaintStyle} from "../styles";
import {jsPlumbInstance} from "../core";
import {OverlayRenderer} from "./overlay-renderer";

export class LabelOverlay<E> implements Overlay<E> {

    label:string | Function;
    labelText:string;
    cssClass:string;

    type:string = "Label";

    isAppendedAtTopLevel: boolean = true;
    location: number = 0.5;
    id:string;

    renderer:OverlayRenderer<E>;

    constructor(protected instance:jsPlumbInstance<E>, public component:Component<E>, p:any) {
        p = p || {};
        this.id = p.id  || uuid();
        this.renderer = instance.renderer.assignOverlayRenderer(this.instance, this);
    }


    setVisible(v: boolean): void {
    }

    cleanup(force?: boolean): void {
        this.renderer.cleanup(force);
    }

    destroy(force?: boolean): void {
        this.renderer.destroy(force);
    }

    getLabel(): string {
        return this.labelText;
    }

    hide(): void {
        this.renderer.setVisible(false);
    }

    show(): void {
        this.renderer.setVisible(true);
    }

    setLabel(l: string | Function): void {
        this.label = l;
        this.labelText = null;
        this.update();
    }

    setLocation(l: any): void {
    }

    setListenerComponent(c: any): void {
    }


    getElement(): any {
        return null;
    }


    isVisible(): boolean {
        return null;
    }

    transfer(target: any): void {
    }

    draw(component: Component<E>, paintStyle: PaintStyle, absolutePosition?: any): any {
        return null;
    }

    paint(params: any, extents?: any): void {
    }


    updateFrom(d: any): void {
        if(d.label != null){
            this.setLabel(d.label);
        }
    }

    reattach(component:Component<E>) {
        // if (this._jsPlumb.div != null) {
        //     instance.getContainer().appendChild(this._jsPlumb.div);
        // }
        // this.detached = false;
    }

    update():void {
        if (isFunction(this.label)) {
            let lt = (this.label as Function)(this);
            this.renderer.setText(lt.replace(/\r\n/g, "<br/>"));
        }
        else {
            if (this.labelText == null) {
                this.labelText = this.label as string;
                this.renderer.setText(this.labelText.replace(/\r\n/g, "<br/>"));
            }
        }
    }
}


Overlays.register("Label", LabelOverlay);