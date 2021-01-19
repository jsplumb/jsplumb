/**
 * Creates a Touch object.
 * @param target
 * @param pageX
 * @param pageY
 * @param screenX
 * @param screenY
 * @param clientX
 * @param clientY
 * @returns {Touch}
 * @private
 */
import { PointArray } from "@jsplumb/community-core";
export declare function pageLocation(e: Event): PointArray;
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
