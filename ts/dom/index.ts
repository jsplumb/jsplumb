
import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import {jsPlumbHelperFunctions} from '../core/defaults'

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
export { BrowserJsPlumbInstance } from './browser-jsplumb-instance'
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
