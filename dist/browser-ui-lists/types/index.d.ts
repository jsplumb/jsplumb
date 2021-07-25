import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { ListManagerOptions, JsPlumbListManager } from "./lists";
export * from './constants';
export * from './lists';
export declare function newInstance(instance: BrowserJsPlumbInstance, params?: ListManagerOptions): JsPlumbListManager;
