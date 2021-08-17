import {BrowserJsPlumbInstance} from "@jsplumb/browser-ui"

import { BrowserUITestSupport} from './test-support'

declare const QUnit:any

export function getInstance(instance:BrowserJsPlumbInstance, ok:(b:boolean, m:string) => any, equal:(v1:any, v2:any, m?:string)=>any) {
    return new BrowserUITestSupport(instance, ok, equal)
}

export function getInstanceQUnit(instance:BrowserJsPlumbInstance) {
    return new BrowserUITestSupport(instance, QUnit.ok, QUnit.equal)
}

export * from './test-support'
