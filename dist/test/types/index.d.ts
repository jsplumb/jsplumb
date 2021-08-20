/**
 * This package contains the test helper that is used internally by jsPlumb. There is a vague notion that this package
 * could be made useful for others, so all feedback on that topic is welcome.
 *
 * @packageDocumentation
 */
import { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import { BrowserUITestSupport } from './test-support';
export declare function getInstance(instance: BrowserJsPlumbInstance, ok: (b: boolean, m: string) => any, equal: (v1: any, v2: any, m?: string) => any): BrowserUITestSupport;
export declare function getInstanceQUnit(instance: BrowserJsPlumbInstance): BrowserUITestSupport;
export * from './test-support';
//# sourceMappingURL=index.d.ts.map