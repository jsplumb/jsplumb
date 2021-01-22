
import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance} from "./browser-jsplumb-instance"

import * as DotEndpointRenderer from './dot-endpoint-renderer'
import * as RectangleEndpointRenderer from './rectangle-endpoint-renderer'
import * as BlankEndpointRenderer from './blank-endpoint-renderer'

import {jsPlumbHelperFunctions} from "@jsplumb/community-core"

DotEndpointRenderer.register()
BlankEndpointRenderer.register()
RectangleEndpointRenderer.register()

let _jsPlumbInstanceIndex = 0
function getInstanceIndex ():number {
    let i = _jsPlumbInstanceIndex + 1
    _jsPlumbInstanceIndex++
    return i
}

export * from './browser-jsplumb-instance'
export * from './collicat'
export { EVENT_DRAG_START, EVENT_DRAG_MOVE, EVENT_DRAG_STOP } from './drag-manager'
export { EventManager, pageLocation } from './event-manager'
export * from "./browser-util"

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
