
import {Constructable, Dictionary, jsPlumbInstance} from "./core";

import {PaintStyle} from "./styles";
import {Component} from "./component/component";


export interface OverlayOptions {
    id?:string;
}

export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number; // 20
    length?: number; // 20
    location?: number; // 0.5
    direction?: number; // 1
    foldback?: number; // 0.623
    paintStyle?: PaintStyle;
}

export interface LabelOverlayOptions extends OverlayOptions {
    label: string;
    cssClass?: string;
    location?: number; // 0.5
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

export interface Overlay<E> {

    id:string;
    setVisible(v:boolean):void;
    cleanup(force?:boolean):void;
    destroy(force?:boolean):void;
    isAppendedAtTopLevel?:boolean;
    getLabel():string;
    hide():void;
    show():void;
    setLabel(l:string|Function):void;
    setLocation(l:any):void;
    location?: number ;

    type:string;

    cssClass:string;

    updateFrom(d:any):void;

    component:Component<E>;

    setListenerComponent(c:any):void;

    reattach(component:Component<E>):void;

    getElement():any;

    isVisible():boolean;

    transfer (target:any):void; // not sure what to do with this, it probably needs to know about the dom.

    draw(component:any, paintStyle:PaintStyle, absolutePosition?:any):any;
    paint(params:any, extents?:any):void;
}

const overlayMap:Dictionary<Constructable<Overlay<any>>> = {};

export const Overlays = {
    get:(instance:jsPlumbInstance<any>, name:string, component:Component<any>, params:any):Overlay<any> => {

        let c:Constructable<Overlay<any>> = overlayMap[name];
        if (!c) {
            throw {message:"jsPlumb: unknown overlay type '" + name + "'"};
        } else {
            return new c(instance, component, params) as Overlay<any>;
        }
    },

    register:(name:string, overlay:Constructable<Overlay<any>>) => {
        overlayMap[name] = overlay;
    }
};



