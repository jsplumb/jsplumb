import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbHelperFunctions } from "@jsplumb/community-core";
export * from './browser-jsplumb-instance';
export * from './collicat';
export { EVENT_DRAG_START, EVENT_DRAG_MOVE, EVENT_DRAG_STOP } from './drag-manager';
export { EventManager, pageLocation } from './event-manager';
export * from "./browser-util";
export declare function newInstance(defaults?: BrowserJsPlumbDefaults, helpers?: jsPlumbHelperFunctions): BrowserJsPlumbInstance;
export declare function ready(f: Function): void;
