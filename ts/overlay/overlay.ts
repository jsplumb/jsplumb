
import {Constructable, Dictionary, jsPlumbInstance} from "../core";

import {PaintStyle} from "../styles";
import {Component} from "../component/component";
import {SegmentBounds} from "../connector/abstract-segment";
import {OverlayRenderer} from "./overlay-renderer";
import {uuid} from "../util";
import {EventGenerator} from "../event-generator";


export interface OverlayOptions {
    id?:string;
    cssClass?: string;
    location?: number; // 0.5
    endpointLoc?:[number, number];
    events?:Dictionary<Function>;
}

export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number; // 20
    length?: number; // 20
    direction?: number; // 1
    foldback?: number; // 0.623
    paintStyle?: PaintStyle;

}

export interface LabelOverlayOptions extends OverlayOptions {
    label: string;
    endpointLocation?:[ number, number ];
    labelStyle?: {
        font?: string;
        color?: string;
        fill?: string;
        borderStyle?: string;
        borderWidth?: number;// integer
        padding?: number; //integer
    };
}

export type OverlayId = "Label" | "Arrow" | "PlainArrow" | "Custom";

export type FullOverlaySpec = [OverlayId, OverlayOptions]
export type OverlaySpec = OverlayId | FullOverlaySpec;

export abstract class Overlay<E> extends EventGenerator {

    id:string;
    abstract type:string;

    cssClass:string;

    private renderer:OverlayRenderer<E>;
    visible:boolean = true;
    location: number;
    endpointLocation:[number, number];

    events?:Dictionary<Function>;

    constructor(protected instance:jsPlumbInstance<E>, public component:Component<E>, p:OverlayOptions) {
        super();
        p = p || {};
        this.id = p.id  || uuid();
        this.cssClass = p.cssClass || "";
        this.location = p.location || 0.5;
        this.events = p.events || {};
    }

    protected setRenderer(r:OverlayRenderer<E>) {
        this.renderer = r;
        let e = r.getElement();
        for (let event in this.events) {
            this.instance.on(e, event, this.events[event]);
        }
    }

    public getRenderer() {
        return this.renderer;
    }


    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true;
    }

    setVisible(v: boolean): void {
        this.visible = v;
        this.renderer.setVisible(v);
    }

    hide(): void {
        this.setVisible(false);
    }

    show(): void {
        this.setVisible(true);
    }

    isVisible(): boolean {
        return this.visible;
    }

    destroy(force?: boolean): void {
        let e = this.renderer.getElement();
        for (let event in this.events) {
            this.instance.off(e, event, this.events[event]);
        }

        this.renderer.destroy(force);
    }

    addClass(clazz:string) {
        this.renderer.addClass(clazz);
    }

    removeClass(clazz:string) {
        this.renderer.removeClass(clazz);
    }

    abstract updateFrom(d:any):void;
    abstract draw(component:any, paintStyle:PaintStyle, absolutePosition?:any):SegmentBounds;

    setListenerComponent(c: any): void {
    }

    reattach(component:Component<E>) {
        // if (this._jsPlumb.div != null) {
        //     instance.getContainer().appendChild(this._jsPlumb.div);
        // }
        // this.detached = false;
    }

    transfer(target: any): void { }



    paint(params: any, extents?: any): void {
        //console.log("PAINT on label overlay called")

        return this.renderer.paint(params, extents);

    }

}





