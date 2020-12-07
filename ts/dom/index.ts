
import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import {jsPlumbHelperFunctions} from '../core/defaults'

import * as DotEndpoint from '../core/endpoint/dot-endpoint'
import * as BlankEndpoint from '../core/endpoint/blank-endpoint'
import * as RectangleEndpoint from '../core/endpoint/rectangle-endpoint'

import * as DotEndpointRenderer from './dot-endpoint-renderer'
import * as RectangleEndpointRenderer from './rectangle-endpoint-renderer'
import * as BlankEndpointRenderer from './blank-endpoint-renderer'

import * as StraightConnector from '../core/connector/straight-connector'
import * as BezierConnector from '../core/connector/bezier-connector'
import * as FlowchartConnector from '../core/connector/flowchart-connector'
import * as StateMachineConnector from '../core/connector/statemachine-connector'

BezierConnector.register()
StraightConnector.register()
FlowchartConnector.register()
StateMachineConnector.register()

DotEndpoint.register()
BlankEndpoint.register()
RectangleEndpoint.register()

DotEndpointRenderer.register()
BlankEndpointRenderer.register()
RectangleEndpointRenderer.register()

let _jsPlumbInstanceIndex = 0
function getInstanceIndex ():number {
    let i = _jsPlumbInstanceIndex + 1
    _jsPlumbInstanceIndex++
    return i
}

export { JsPlumbInstance } from '../core/core'
export * from './browser-jsplumb-instance'
export * from './collicat'
export { EventManager } from './event-manager'
export { uuid, extend } from '../core/util'

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
