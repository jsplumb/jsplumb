import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
export * from './constants';
export * from './browser-jsplumb-instance';
export * from './collicat';
export { EVENT_DRAG_START, EVENT_DRAG_MOVE, EVENT_DRAG_STOP, EVENT_CONNECTION_DRAG, EVENT_CONNECTION_ABORT } from './constants';
export { EventManager, pageLocation, touches, touchCount, getTouch, getPageLocation, setForceTouchEvents, setForceMouseEvents, isTouchDevice, isMouseDevice } from './event-manager';
export * from "./browser-util";
export * from './element-facade';
export * from './element-drag-handler';
export * from './drag-manager';
export { svg } from './svg-util';
/**
 * Create a new BrowserJsPlumbInstance, optionally with the given defaults.
 * @param defaults
 * @public
 */
export declare function newInstance(defaults?: BrowserJsPlumbDefaults): BrowserJsPlumbInstance;
/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export declare function ready(f: Function): void;
//# sourceMappingURL=index.d.ts.map