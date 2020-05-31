import { PaintStyle } from "../styles";
import { jsPlumbInstance } from "../core";
export interface SvgComponentOptions {
    pointerEventsSpec?: string;
    cssClass?: string;
    useDivWrapper?: boolean;
}
export declare type Positionable = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare abstract class SvgComponent {
    pointerEventsSpec: string;
    svg: SVGElement;
    renderer: any;
    clazz: string;
    useDivWrapper: boolean;
    canvas: HTMLElement;
    bgCanvas: HTMLElement;
    static staticPaint<E>(connector: any, useDivWrapper: boolean, paintStyle: PaintStyle, extents?: any): void;
    cleanup(force?: boolean): void;
    reattach<E>(instance: jsPlumbInstance<E>): void;
    setVisible(v: boolean): void;
}
