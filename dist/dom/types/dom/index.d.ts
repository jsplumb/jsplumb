import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbHelperFunctions } from '../core/defaults';
export { JsPlumbInstance } from '../core/core';
export * from './browser-jsplumb-instance';
export * from './collicat';
export { EventManager } from './event-manager';
export { uuid, extend } from '../core/util';
export declare function newInstance(defaults?: BrowserJsPlumbDefaults, helpers?: jsPlumbHelperFunctions): BrowserJsPlumbInstance;
export declare function ready(f: Function): void;
