import { PointArray } from "./core";
export declare function pageLocation(e: Event): PointArray;
interface FunctionFacade {
    __tauid: number;
    __taExtra: Array<any>;
    __taUnstore?: Function;
    apply: (obj: any, ...args: Array<any>) => any;
}
declare type Handler = (obj: any, evt: string, fn: FunctionFacade, children?: string) => void;
export interface EventManagerOptions {
    clickThreshold?: number;
    dblClickThreshold?: number;
    smartClicks?: boolean;
}
export declare class EventManager {
    clickThreshold: number;
    dblClickThreshold: number;
    tapHandler: Handler;
    mouseEnterExitHandler: Handler;
    smartClicks: boolean;
    constructor(params?: EventManagerOptions);
    private _doBind;
    remove(el: any): this;
    on(el: any, event: string, children?: string | Function, fn?: Function): this;
    off(el: any, event: string, fn: any): this;
    trigger(el: any, event: string, originalEvent: any, payload?: any): this;
}
export declare function setForceTouchEvents(value: boolean): void;
export declare function setForceMouseEvents(value: boolean): void;
export {};
