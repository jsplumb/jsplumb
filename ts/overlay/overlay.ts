
import {Dictionary, jsPlumbInstance} from "../core";

import {PaintStyle} from "../styles";
import {Component} from "../component/component";
import {uuid} from "../util";
import {EventGenerator} from "../event-generator";
import {Connection} from "..";


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
    labelLocationAttribute?:string;
}

export interface CustomOverlayOptions<E> extends OverlayOptions {

    create:(c:Component<E>) => E;

}

export type OverlayId = "Label" | "Arrow" | "PlainArrow" | "Custom";

export type FullOverlaySpec = [OverlayId, OverlayOptions]
export type OverlaySpec = OverlayId | FullOverlaySpec;

export abstract class Overlay<E> extends EventGenerator {

    id:string;
    abstract type:string;

    cssClass:string;

    visible:boolean = true;
    location: number;
    endpointLocation:[number, number];

    events?:Dictionary<Function>;

    constructor(public instance:jsPlumbInstance<E>, public component:Component<E>, p:OverlayOptions) {
        super();
        p = p || {};
        this.id = p.id  || uuid();
        this.cssClass = p.cssClass || "";
        this.location = p.location || 0.5;
        this.events = p.events || {};

        for (let event in this.events) {
            this.bind(event, this.events[event]);
        }
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true;
    }

    setVisible(v: boolean): void {
        this.visible = v;
        this.instance.renderer.setOverlayVisible(this, v);
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
        this.instance.renderer.destroyOverlay(this, force);

    }

    addClass(clazz:string) {
        this.instance.renderer.addOverlayClass(this, clazz);
    }

    removeClass(clazz:string) {
        this.instance.renderer.removeOverlayClass(this, clazz);
    }

    abstract updateFrom(d:any):void;

    reattach(component:Component<E>) {


        console.log("reattach overlay");

        debugger

        // if (this._jsPlumb.div != null) {
        //     instance.getContainer().appendChild(this._jsPlumb.div);
        // }
        // this.detached = false;
    }

    transfer(target: any): void { }

    private _postComponentEvent(eventName:string, originalEvent:Event) {
        this.instance.fire(eventName, this.component, originalEvent);
    }

    click(e:Event) {
        this.fire("click", e);
        let eventName = this.component instanceof Connection ? "click" : "endpointClick";
        this._postComponentEvent(eventName, e);
    }

    dblClick(e:Event) {
        this.fire("click", e);
        let eventName = this.component instanceof Connection ? "dblclick" : "endpointDblClick";
        this._postComponentEvent(eventName, e);
    }

}





