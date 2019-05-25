
import {Overlay} from "./overlay";
import {isFunction, uuid} from "../util";
import {Component} from "../component/component";
import {PaintStyle} from "../styles";
import {jsPlumbInstance, PointArray} from "../core";
import {LabelOverlayRenderer, OverlayRenderer} from "./overlay-renderer";
import {OverlayFactory} from "../factory/overlay-factory";

export class LabelOverlay<E> implements Overlay<E> {

    label:string | Function;
    labelText:string;
    cssClass:string;

    type:string = "Label";

    isAppendedAtTopLevel: boolean = true;
    location: number | [ number, number ];
    endpointLoc:[number, number];

    id:string;

    cachedDimensions:PointArray;

    visible:boolean = true;

    renderer:LabelOverlayRenderer<E>;

    constructor(protected instance:jsPlumbInstance<E>, public component:Component<E>, p:any) {
        p = p || {};
        this.id = p.id  || uuid();
        this.renderer = this.instance.renderer.assignOverlayRenderer(this.instance, this) as LabelOverlayRenderer<E>;
        this.location = p.location || 0.5;
        this.endpointLoc = p.endpointLocation == null ? [ 0.5, 0.5] : p.endpointLocation;
        this.setLabel(p.label);
    }


    setVisible(v: boolean): void {
        this.visible = v;
        this.renderer.setVisible(v);
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
        this.setVisible(false);
    }

    show(): void {
        this.setVisible(true);
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
        return this.visible;
    }

    transfer(target: any): void {
    }

    private _getDimensions(forceRefresh?:boolean):PointArray {
        if (this.cachedDimensions == null || forceRefresh) {
            this.cachedDimensions = this.getDimensions();
        }
        return this.cachedDimensions;
    }

    getDimensions():PointArray { return [1,1];}

    draw(component:Component<HTMLElement>, currentConnectionPaintStyle:PaintStyle, absolutePosition?:PointArray): any {
        console.log("DRAW on label overlay called", component)

        return this.renderer.draw(component, currentConnectionPaintStyle, absolutePosition);
    }

    paint(params: any, extents?: any): void {
        console.log("PAINT on label overlay called")

        return this.renderer.paint(params, extents);

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
            if (lt != null) {
                this.renderer.setText(lt.replace(/\r\n/g, "<br/>"));
            } else {
                this.renderer.setText("");
            }

        }
        else {
            if (this.labelText == null) {
                this.labelText = this.label as string;
                if (this.labelText != null) {
                    this.renderer.setText(this.labelText.replace(/\r\n/g, "<br/>"));
                } else {
                    this.renderer.setText("");
                }

            }
        }
    }
}


OverlayFactory.register("Label", LabelOverlay);