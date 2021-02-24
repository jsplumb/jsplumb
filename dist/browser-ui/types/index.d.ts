import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
export * from './browser-jsplumb-instance';
export * from './collicat';
export { EVENT_DRAG_START, EVENT_DRAG_MOVE, EVENT_DRAG_STOP, EVENT_CONNECTION_DRAG, EVENT_CONNECTION_ABORT } from './drag-manager';
export { EventManager, pageLocation, touches, touchCount, getTouch } from './event-manager';
export * from "./browser-util";
export * from './element-facade';
export declare function newInstance(defaults?: BrowserJsPlumbDefaults): BrowserJsPlumbInstance;
export declare function ready(f: Function): void;
