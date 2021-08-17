import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { BrowserUITestSupport } from './test-support';
export declare function getInstance(instance: BrowserJsPlumbInstance, ok: (b: boolean, m: string) => any, equal: (v1: any, v2: any, m?: string) => any): BrowserUITestSupport;
export declare function getInstanceQUnit(instance: BrowserJsPlumbInstance): BrowserUITestSupport;
export * from './test-support';
