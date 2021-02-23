import { PointXY } from "@jsplumb/core";
export declare function pageLocation(e: Event): PointXY;
export declare function getTouch(touches: TouchList, idx: number): Touch;
export declare function touches(e: any): TouchList;
export declare function touchCount(e: Event): number;
export interface EventManagerOptions {
    clickThreshold?: number;
    dblClickThreshold?: number;
    smartClicks?: boolean;
}
export declare class EventManager {
    clickThreshold: number;
    dblClickThreshold: number;
    private readonly tapHandler;
    private readonly mouseEnterExitHandler;
    smartClicks: boolean;
    constructor(params?: EventManagerOptions);
    private _doBind;
    on(el: any, event: string, children?: string | Function, fn?: Function): this;
    off(el: any, event: string, fn: any): this;
    trigger(el: any, event: string, originalEvent: any, payload?: any): this;
}
export declare function setForceTouchEvents(value: boolean): void;
export declare function setForceMouseEvents(value: boolean): void;
