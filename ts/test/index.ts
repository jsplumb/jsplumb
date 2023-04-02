import { BrowserUITestSupport} from './test-support'
import {BrowserJsPlumbInstance} from "../browser-ui-renderer/browser-jsplumb-instance"

declare const QUnit:any

/**
 * Create an instance of BrowserUITestSupport, using the given functions for testing boolean and equality.
 * @param instance - The jsPlumb instance to attach to.
 * @param ok - A function that tests a boolean.
 * @param equal - A function that tests for equality.
 * @public
 */
export function createTestSupportInstance(instance:BrowserJsPlumbInstance, ok:(b:boolean, msg:string) => any, equal:(v1:any, v2:any, m?:string)=>any) {
    return new BrowserUITestSupport(instance, ok, equal)
}

/**
 * Create an instance of BrowserUITestSupport that uses QUnit, a now venerable testing framework, admittedly, but one
 * which jsPlumb still uses.
 * @param instance - The jsPlumb instance to attach to.
 * @public
 */
export function createTestSupportInstanceQUnit(instance:BrowserJsPlumbInstance) {
    return new BrowserUITestSupport(instance, QUnit.ok, QUnit.equal)
}

export * from './test-support'
