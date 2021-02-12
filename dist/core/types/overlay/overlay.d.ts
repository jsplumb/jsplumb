import { JsPlumbInstance } from "../core";
import { Dictionary } from '../common';
import { PaintStyle } from "../styles";
import { Component } from "../component/component";
import { EventGenerator } from "../event-generator";
export interface OverlayOptions extends Record<string, any> {
    id?: string;
    cssClass?: string;
    location?: number | number[];
    events?: Dictionary<(value: any, event?: any) => any>;
}
export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}
export interface LabelOverlayOptions extends OverlayOptions {
    label: string;
    labelLocationAttribute?: string;
}
export interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}
export declare type FullOverlaySpec = {
    type: string;
    options: OverlayOptions;
};
export declare type OverlaySpec = string | FullOverlaySpec;
export declare abstract class Overlay extends EventGenerator {
    instance: JsPlumbInstance;
    component: Component;
    id: string;
    abstract type: string;
    cssClass: string;
    visible: boolean;
    location: number | Array<number>;
    events?: Dictionary<(value: any, event?: any) => any>;
    constructor(instance: JsPlumbInstance, component: Component, p: OverlayOptions);
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    destroy(force?: boolean): void;
    abstract updateFrom(d: any): void;
    private _postComponentEvent;
    click(e: Event): void;
    dblclick(e: Event): void;
}
