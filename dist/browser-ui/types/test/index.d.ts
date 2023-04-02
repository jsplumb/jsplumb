import { BrowserUITestSupport } from './test-support';
import { BrowserJsPlumbInstance } from "../browser-ui-renderer/browser-jsplumb-instance";
/**
 * Create an instance of BrowserUITestSupport, using the given functions for testing boolean and equality.
 * @param instance - The jsPlumb instance to attach to.
 * @param ok - A function that tests a boolean.
 * @param equal - A function that tests for equality.
 * @public
 */
export declare function createTestSupportInstance(instance: BrowserJsPlumbInstance, ok: (b: boolean, msg: string) => any, equal: (v1: any, v2: any, m?: string) => any): BrowserUITestSupport;
/**
 * Create an instance of BrowserUITestSupport that uses QUnit, a now venerable testing framework, admittedly, but one
 * which jsPlumb still uses.
 * @param instance - The jsPlumb instance to attach to.
 * @public
 */
export declare function createTestSupportInstanceQUnit(instance: BrowserJsPlumbInstance): BrowserUITestSupport;
export * from './test-support';
//# sourceMappingURL=index.d.ts.map