
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

export interface CustomOverlayOptions extends OverlayOptions {
    create:(c:Component) => any;
}

export type OverlayId = "Label" | "Arrow" | "PlainArrow" | "Custom";

export type FullOverlaySpec = [OverlayId, OverlayOptions]
export type OverlaySpec = OverlayId | FullOverlaySpec;

export abstract class Overlay extends EventGenerator {

    id:string;
    abstract type:string;

    cssClass:string;

    visible:boolean = true;
    location: number;
    endpointLocation:[number, number];

    events?:Dictionary<Function>;

    constructor(public instance:jsPlumbInstance, public component:Component, p:OverlayOptions) {
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
        console.log("setting visible " + v + " " + this);
        this.instance.renderer.setOverlayVisible(this, v);
    }

    isVisible(): boolean {
        return this.visible;
    }

    destroy(force?: boolean): void {
        this.instance.renderer.destroyOverlay(this, force);
    }

    /**
     * Add a class to the overlay.
     * @param clazz
     */
    addClass(clazz:string) {
        this.instance.renderer.addOverlayClass(this, clazz);
    }

    /**
     * Remove a class from the overlay.
     * @param clazz
     */
    removeClass(clazz:string) {
        this.instance.renderer.removeOverlayClass(this, clazz);
    }

    abstract updateFrom(d:any):void;

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





