
import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import {jsPlumbHelperFunctions} from '../core/defaults'

export * from "./dot-endpoint-renderer"
export * from "./rectangle-endpoint-renderer"
export * from "./blank-endpoint-renderer"

export * from '../core/endpoint/blank-endpoint'
export * from '../core/endpoint/rectangle-endpoint'
export * from '../core/endpoint/dot-endpoint'

export * from '../core/connector/bezier-connector'
export * from '../core/connector/straight-connector'
export * from '../core/connector/flowchart-connector'
export * from '../core/connector/statemachine-connector'

let _jsPlumbInstanceIndex = 0

function getInstanceIndex ():number {
    let i = _jsPlumbInstanceIndex + 1
    _jsPlumbInstanceIndex++
    return i
}

export { EventManager } from './event-manager'
export { extend } from '../core/core'

export function newInstance(defaults?:BrowserJsPlumbDefaults, helpers?:jsPlumbHelperFunctions): BrowserJsPlumbInstance {
    return new BrowserJsPlumbInstance(getInstanceIndex(), defaults, helpers)
}

export function ready(f:Function) {
    const _do = function () {
        if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
            f()
        }
        else {
            setTimeout(_do, 9)
        }
    }

    _do()
}
