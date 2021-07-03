import {
    att,
    ATTRIBUTE_GROUP,
    CLASS_CONNECTOR,
    CLASS_ENDPOINT,
    CLASS_OVERLAY,
    cls
} from "@jsplumb/core"

export function compoundEvent(stem:string, event:string, subevent?:string) {
    const a = [stem, event]
    if (subevent) {
        a.push(subevent)
    }
    return a.join(":")
}

export const ATTRIBUTE_CONTAINER = "data-jtk-container"
export const ATTRIBUTE_GROUP_CONTENT = "data-jtk-group-content"
export const ATTRIBUTE_JTK_ENABLED = "data-jtk-enabled"

export const ENDPOINT = "endpoint"
export const ELEMENT = "element"
export const CONNECTION = "connection"

export const ELEMENT_DIV = "div"

export const EVENT_CLICK = "click"

export const EVENT_CONTEXTMENU = "contextmenu"
export const EVENT_DBL_CLICK = "dblclick"
export const EVENT_DBL_TAP = "dbltap"

export const EVENT_FOCUS = "focus"
export const EVENT_MOUSEDOWN = "mousedown"
export const EVENT_MOUSEENTER = "mouseenter"
export const EVENT_MOUSEEXIT = "mouseexit"
export const EVENT_MOUSEMOVE = "mousemove"
export const EVENT_MOUSEUP = "mouseup"
export const EVENT_MOUSEOUT = "mouseout"
export const EVENT_MOUSEOVER = "mouseover"
export const EVENT_TAP = "tap"

export const EVENT_DRAG_MOVE = "drag:move"
export const EVENT_DRAG_STOP = "drag:stop"
export const EVENT_DRAG_START = "drag:start"
export const EVENT_REVERT = "revert"
export const EVENT_CONNECTION_ABORT = "connection:abort"
export const EVENT_CONNECTION_DRAG = "connection:drag"

export const EVENT_ELEMENT_CLICK = compoundEvent(ELEMENT, EVENT_CLICK)
export const EVENT_ELEMENT_DBL_CLICK = compoundEvent(ELEMENT, EVENT_DBL_CLICK)
export const EVENT_ELEMENT_DBL_TAP = compoundEvent(ELEMENT, EVENT_DBL_TAP)
export const EVENT_ELEMENT_MOUSE_OUT = compoundEvent(ELEMENT, EVENT_MOUSEOUT)
export const EVENT_ELEMENT_MOUSE_OVER = compoundEvent(ELEMENT, EVENT_MOUSEOVER)
export const EVENT_ELEMENT_TAP = compoundEvent(ELEMENT, EVENT_TAP)

export const EVENT_ENDPOINT_CLICK = compoundEvent(ENDPOINT, EVENT_CLICK)
export const EVENT_ENDPOINT_DBL_CLICK = compoundEvent(ENDPOINT, EVENT_DBL_CLICK)
export const EVENT_ENDPOINT_DBL_TAP = compoundEvent(ENDPOINT, EVENT_DBL_TAP)
export const EVENT_ENDPOINT_MOUSEOUT = compoundEvent(ENDPOINT, EVENT_MOUSEOUT)
export const EVENT_ENDPOINT_MOUSEOVER = compoundEvent(ENDPOINT, EVENT_MOUSEOVER)
export const EVENT_ENDPOINT_TAP = compoundEvent(ENDPOINT, EVENT_TAP)

export const EVENT_CONNECTION_CLICK = compoundEvent(CONNECTION, EVENT_CLICK)
export const EVENT_CONNECTION_DBL_CLICK = compoundEvent(CONNECTION, EVENT_DBL_CLICK)
export const EVENT_CONNECTION_DBL_TAP = compoundEvent(CONNECTION, EVENT_DBL_TAP)
export const EVENT_CONNECTION_MOUSEOUT = compoundEvent(CONNECTION, EVENT_MOUSEOUT)
export const EVENT_CONNECTION_MOUSEOVER = compoundEvent(CONNECTION, EVENT_MOUSEOVER)
export const EVENT_CONNECTION_TAP = compoundEvent(CONNECTION, EVENT_TAP)

export const PROPERTY_POSITION = "position"

export const SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR)
export const SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT)
export const SELECTOR_GROUP = att(ATTRIBUTE_GROUP)
export const SELECTOR_GROUP_CONTAINER = att(ATTRIBUTE_GROUP_CONTENT)
export const SELECTOR_OVERLAY = cls(CLASS_OVERLAY)







