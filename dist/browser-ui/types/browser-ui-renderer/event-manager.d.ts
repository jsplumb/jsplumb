import { PointXY } from "../util/util";
export declare function isTouchDevice(): boolean;
export declare function isMouseDevice(): boolean;
export declare function pageLocation(e: Event): PointXY;
export declare function getTouch(touches: TouchList, idx: number): Touch;
export declare function touches(e: any): TouchList;
export declare function touchCount(e: Event): number;
/**
 * Gets the page location for the given event, abstracting out differences between touch and mouse events.
 * @param e
 */
export declare function getPageLocation(e: any): PointXY;
export interface EventManagerOptions {
    clickThreshold?: number;
    dblClickThreshold?: number;
}
export declare class EventManager {
    clickThreshold: number;
    dblClickThreshold: number;
    private readonly tapHandler;
    private readonly mouseEnterExitHandler;
    constructor(params?: EventManagerOptions);
    private _doBind;
    on(el: any, event: string, children?: string | Function, fn?: Function, options?: {
        passive?: boolean;
        capture?: boolean;
        once?: boolean;
    }): this;
    off(el: any, event: string, fn: any): this;
    trigger(el: any, event: string, originalEvent: any, payload?: any, detail?: number): this;
}
export declare function setForceTouchEvents(value: boolean): void;
export declare function setForceMouseEvents(value: boolean): void;
//# sourceMappingURL=event-manager.d.ts.map