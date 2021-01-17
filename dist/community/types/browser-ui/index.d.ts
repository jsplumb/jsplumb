import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbHelperFunctions } from "@jsplumb/community-core";
export * from './browser-jsplumb-instance';
export * from './collicat';
export { EventManager } from './event-manager';
export declare function newInstance(defaults?: BrowserJsPlumbDefaults, helpers?: jsPlumbHelperFunctions): BrowserJsPlumbInstance;
export declare function ready(f: Function): void;
