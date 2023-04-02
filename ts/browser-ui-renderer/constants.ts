import {att, ATTRIBUTE_GROUP, CLASS_CONNECTOR, CLASS_ENDPOINT, CLASS_OVERLAY, cls} from "../core/constants"

export function compoundEvent(stem:string, event:string, subevent?:string) {
    const a = [stem, event]
    if (subevent) {
        a.push(subevent)
    }
    return a.join(":")
}

/**
 * @public
 */
export const ATTRIBUTE_CONTAINER = "data-jtk-container"
/**
 * @public
 */
export const ATTRIBUTE_GROUP_CONTENT = "data-jtk-group-content"
/**
 * @public
 */
export const ATTRIBUTE_JTK_ENABLED = "data-jtk-enabled"
/**
 * @public
 */
export const ATTRIBUTE_JTK_SCOPE = "data-jtk-scope"

/**
 * @public
 */
export const ENDPOINT = "endpoint"
/**
 * @public
 */
export const ELEMENT = "element"
/**
 * @public
 */
export const CONNECTION = "connection"

/**
 * @public
 */
export const ELEMENT_DIV = "div"
/**
 * @public
 */
export const EVENT_CLICK = "click"
/**
 * @public
 */
export const EVENT_CONTEXTMENU = "contextmenu"
/**
 * @public
 */
export const EVENT_DBL_CLICK = "dblclick"
/**
 * @public
 */
export const EVENT_DBL_TAP = "dbltap"

/**
 * @public
 */
export const EVENT_FOCUS = "focus"
/**
 * @public
 */
export const EVENT_MOUSEDOWN = "mousedown"
/**
 * @public
 */
export const EVENT_MOUSEENTER = "mouseenter"
/**
 * @public
 */
export const EVENT_MOUSEEXIT = "mouseexit"
/**
 * @public
 */
export const EVENT_MOUSEMOVE = "mousemove"
/**
 * @public
 */
export const EVENT_MOUSEUP = "mouseup"
/**
 * @public
 */
export const EVENT_MOUSEOUT = "mouseout"
/**
 * @public
 */
export const EVENT_MOUSEOVER = "mouseover"
/**
 * @public
 */
export const EVENT_TAP = "tap"
/**
 * @public
 */
export const EVENT_TOUCHSTART = "touchstart"
/**
 * @public
 */
export const EVENT_TOUCHEND = "touchend"
/**
 * @public
 */
export const EVENT_TOUCHMOVE = "touchmove"
/**
 * @public
 */
export const EVENT_DRAG_MOVE = "drag:move"
/**
 * @public
 */
export const EVENT_DRAG_STOP = "drag:stop"
/**
 * @public
 */
export const EVENT_DRAG_START = "drag:start"
/**
 * @public
 */
export const EVENT_REVERT = "revert"
/**
 * @public
 */
export const EVENT_CONNECTION_ABORT = "connection:abort"
/**
 * @public
 */
export const EVENT_CONNECTION_DRAG = "connection:drag"

/**
 * @public
 */
export const EVENT_ELEMENT_CLICK = compoundEvent(ELEMENT, EVENT_CLICK)
/**
 * @public
 */
export const EVENT_ELEMENT_DBL_CLICK = compoundEvent(ELEMENT, EVENT_DBL_CLICK)
/**
 * @public
 */
export const EVENT_ELEMENT_DBL_TAP = compoundEvent(ELEMENT, EVENT_DBL_TAP)
/**
 * @public
 */
export const EVENT_ELEMENT_MOUSE_OUT = compoundEvent(ELEMENT, EVENT_MOUSEOUT)
/**
 * @public
 */
export const EVENT_ELEMENT_MOUSE_OVER = compoundEvent(ELEMENT, EVENT_MOUSEOVER)
/**
 * @public
 */
export const EVENT_ELEMENT_MOUSE_MOVE = compoundEvent(ELEMENT, EVENT_MOUSEMOVE)
/**
 * @public
 */
export const EVENT_ELEMENT_MOUSE_UP = compoundEvent(ELEMENT, EVENT_MOUSEUP)
/**
 * @public
 */
export const EVENT_ELEMENT_MOUSE_DOWN = compoundEvent(ELEMENT, EVENT_MOUSEDOWN)
/**
 * @public
 */
export const EVENT_ELEMENT_CONTEXTMENU = compoundEvent(ELEMENT, EVENT_CONTEXTMENU)
/**
 * @public
 */
export const EVENT_ELEMENT_TAP = compoundEvent(ELEMENT, EVENT_TAP)
/**
 * @public
 */
export const EVENT_ENDPOINT_CLICK = compoundEvent(ENDPOINT, EVENT_CLICK)
/**
 * @public
 */
export const EVENT_ENDPOINT_DBL_CLICK = compoundEvent(ENDPOINT, EVENT_DBL_CLICK)
/**
 * @public
 */
export const EVENT_ENDPOINT_DBL_TAP = compoundEvent(ENDPOINT, EVENT_DBL_TAP)
/**
 * @public
 */
export const EVENT_ENDPOINT_MOUSEOUT = compoundEvent(ENDPOINT, EVENT_MOUSEOUT)
/**
 * @public
 */
export const EVENT_ENDPOINT_MOUSEOVER = compoundEvent(ENDPOINT, EVENT_MOUSEOVER)
/**
 * @public
 */
export const EVENT_ENDPOINT_MOUSEUP = compoundEvent(ENDPOINT, EVENT_MOUSEUP)
/**
 * @public
 */
export const EVENT_ENDPOINT_MOUSEDOWN = compoundEvent(ENDPOINT, EVENT_MOUSEDOWN)
/**
 * @public
 */
export const EVENT_ENDPOINT_TAP = compoundEvent(ENDPOINT, EVENT_TAP)

/**
 * @public
 */
export const EVENT_CONNECTION_CLICK = compoundEvent(CONNECTION, EVENT_CLICK)
/**
 * @public
 */
export const EVENT_CONNECTION_DBL_CLICK = compoundEvent(CONNECTION, EVENT_DBL_CLICK)
/**
 * @public
 */
export const EVENT_CONNECTION_DBL_TAP = compoundEvent(CONNECTION, EVENT_DBL_TAP)
/**
 * @public
 */
export const EVENT_CONNECTION_MOUSEOUT = compoundEvent(CONNECTION, EVENT_MOUSEOUT)
/**
 * @public
 */
export const EVENT_CONNECTION_MOUSEOVER = compoundEvent(CONNECTION, EVENT_MOUSEOVER)
/**
 * @public
 */
export const EVENT_CONNECTION_MOUSEUP = compoundEvent(CONNECTION, EVENT_MOUSEUP)
/**
 * @public
 */
export const EVENT_CONNECTION_MOUSEDOWN = compoundEvent(CONNECTION, EVENT_MOUSEDOWN)
/**
 * @public
 */
export const EVENT_CONNECTION_CONTEXTMENU = compoundEvent(CONNECTION, EVENT_CONTEXTMENU)
/**
 * @public
 */
export const EVENT_CONNECTION_TAP = compoundEvent(CONNECTION, EVENT_TAP)

/**
 * @public
 */
export const PROPERTY_POSITION = "position"

/**
 * @public
 */
export const SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR)
/**
 * @public
 */
export const SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT)
/**
 * @public
 */
export const SELECTOR_GROUP = att(ATTRIBUTE_GROUP)
/**
 * @public
 */
export const SELECTOR_GROUP_CONTAINER = att(ATTRIBUTE_GROUP_CONTENT)
/**
 * @public
 */
export const SELECTOR_OVERLAY = cls(CLASS_OVERLAY)







