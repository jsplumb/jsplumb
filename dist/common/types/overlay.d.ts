import { Dictionary } from "@jsplumb/util";
import { Component } from "@jsplumb/core";
import { PaintStyle } from './paint-style';
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
    label: string | Function;
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
