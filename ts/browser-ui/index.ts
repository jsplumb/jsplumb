
import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance} from "./browser-jsplumb-instance"

import * as DotEndpointRenderer from './dot-endpoint-renderer'
import * as RectangleEndpointRenderer from './rectangle-endpoint-renderer'
import * as BlankEndpointRenderer from './blank-endpoint-renderer'

DotEndpointRenderer.register()
BlankEndpointRenderer.register()
RectangleEndpointRenderer.register()

let _jsPlumbInstanceIndex = 0
function getInstanceIndex ():number {
    let i = _jsPlumbInstanceIndex + 1
    _jsPlumbInstanceIndex++
    return i
}

export * from './constants'
export * from './browser-jsplumb-instance'
export * from './collicat'
export { EVENT_DRAG_START, EVENT_DRAG_MOVE, EVENT_DRAG_STOP, EVENT_CONNECTION_DRAG, EVENT_CONNECTION_ABORT} from './constants'
export { EventManager, pageLocation, touches, touchCount, getTouch } from './event-manager'
export * from "./browser-util"
export * from './element-facade'
export * from './element-drag-handler'
export * from './lists'

export function newInstance(defaults?:BrowserJsPlumbDefaults): BrowserJsPlumbInstance {
    return new BrowserJsPlumbInstance(getInstanceIndex(), defaults)
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
