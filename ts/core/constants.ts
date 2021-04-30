
export function cls(...className:Array<string>):string {
    return  className.map((cn:string) => "." + cn).join(",")
}

export function classList(...className:Array<string>):string {
    return className.join(" ")
}

export function att(...attName:Array<string>):string {
    return attName.map((an:string) => "[" + an + "]").join(",")
}

export const DEFAULT = "default"
export const WILDCARD = "*"
export const SOURCE = "source"
export const TARGET = "target"
export const BLOCK = "block"
export const NONE = "none"
export const SOURCE_INDEX = 0
export const TARGET_INDEX = 1

export const TRUE = "true"
export const FALSE = "false"

export const UNDEFINED = "undefined"

export const ABSOLUTE = "absolute"
export const FIXED = "fixed"
export const STATIC = "static"

export const ATTRIBUTE_CONTAINER = "data-jtk-container"
export const ATTRIBUTE_GROUP = "data-jtk-group"
export const ATTRIBUTE_GROUP_CONTENT = "data-jtk-group-content"
export const ATTRIBUTE_MANAGED = "data-jtk-vertex-id"
export const ATTRIBUTE_NOT_DRAGGABLE = "data-jtk-not-draggable"
export const ATTRIBUTE_TABINDEX = "tabindex"
export const ATTRIBUTE_SCOPE = "data-jtk-scope"
export const ATTRIBUTE_SCOPE_PREFIX = ATTRIBUTE_SCOPE + "-"

export const CHECK_CONDITION = "checkCondition"

export const CHECK_DROP_ALLOWED = "checkDropAllowed"
export const CLASS_CONNECTOR = "jtk-connector"
export const CLASS_CONNECTOR_OUTLINE = "jtk-connector-outline"

export const CLASS_CONNECTED = "jtk-connected"

export const CLASS_ENDPOINT = "jtk-endpoint"
export const CLASS_ENDPOINT_CONNECTED = "jtk-endpoint-connected"
export const CLASS_ENDPOINT_FULL = "jtk-endpoint-full"
export const CLASS_ENDPOINT_DROP_ALLOWED = "jtk-endpoint-drop-allowed"
export const CLASS_ENDPOINT_DROP_FORBIDDEN = "jtk-endpoint-drop-forbidden"
export const CLASS_ENDPOINT_ANCHOR_PREFIX = "jtk-endpoint-anchor"

export const CLASS_GROUP_COLLAPSED = "jtk-group-collapsed"
export const CLASS_GROUP_EXPANDED = "jtk-group-expanded"
export const CLASS_OVERLAY = "jtk-overlay"
export const CMD_ORPHAN_ALL = "orphanAll"
export const CMD_HIDE = "hide"

export const CMD_REMOVE_ALL = "removeAll"
export const CMD_SHOW = "show"
export const EVENT_CLICK = "click"

export const EVENT_ANCHOR_CHANGED = "anchor:changed"
export const EVENT_CONNECTION = "connection"
export const EVENT_CONNECTION_DETACHED = "connection:detach"
export const EVENT_CONNECTION_MOVED = "connection:move"

export const EVENT_CONNECTION_MOUSEOUT = "connectionMouseOut"
export const EVENT_CONNECTION_MOUSEOVER = "connectionMouseOver"
export const EVENT_CONTAINER_CHANGE = "container:change"
export const EVENT_CONTEXTMENU = "contextmenu"
export const EVENT_DBL_CLICK = "dblclick"
export const EVENT_DBL_TAP = "dbltap"
export const EVENT_ELEMENT_CLICK = "elementClick"
export const EVENT_ELEMENT_DBL_CLICK = "elementDblClick"
export const EVENT_ELEMENT_TAP = "elementTap"
export const EVENT_ELEMENT_DBL_TAP = "elementDblTap"
export const EVENT_ELEMENT_MOUSE_MOVE = "elementMousemove"
export const EVENT_ELEMENT_MOUSE_OUT = "elementMouseout"
export const EVENT_ELEMENT_MOUSE_OVER = "elementMouseover"
export const EVENT_ENDPOINT_CLICK = "endpointClick"
export const EVENT_ENDPOINT_DBL_CLICK = "endpointDblClick"
export const EVENT_ENDPOINT_TAP = "endpointTap"
export const EVENT_ENDPOINT_DBL_TAP= "endpointDblTap"
export const EVENT_ENDPOINT_MOUSEOUT = "endpointMouseOut"
export const EVENT_ENDPOINT_MOUSEOVER = "endpointMouseOver"
export const EVENT_ENDPOINT_REPLACED = "endpoint:replaced"
export const EVENT_INTERNAL_ENDPOINT_UNREGISTERED = "internal.endpointUnregistered"
export const EVENT_FOCUS = "focus"
export const EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connection:detach"
export const EVENT_MANAGE_ELEMENT = "manageElement"
export const EVENT_MOUSEDOWN = "mousedown"
export const EVENT_MOUSEENTER = "mouseenter"
export const EVENT_MOUSEEXIT = "mouseexit"
export const EVENT_MOUSEMOVE = "mousemove"
export const EVENT_MOUSEOUT = "mouseout"
export const EVENT_MOUSEOVER = "mouseover"
export const EVENT_MOUSEUP = "mouseup"
export const EVENT_GROUP_ADDED = "group:add"
export const EVENT_GROUP_COLLAPSE = "group:collapse"
export const EVENT_GROUP_EXPAND = "group:expand"
export const EVENT_GROUP_MEMBER_ADDED = "group:addMember"
export const EVENT_GROUP_MEMBER_REMOVED = "group:removeMember"
export const EVENT_GROUP_REMOVED = "group:remove"
export const EVENT_MAX_CONNECTIONS = "maxConnections"
export const EVENT_NESTED_GROUP_ADDED = "nestedGroupAdded"
export const EVENT_NESTED_GROUP_REMOVED = "nestedGroupRemoved"
export const EVENT_TAP = "tap"
export const EVENT_UNMANAGE_ELEMENT = "unmanageElement"
export const EVENT_UPDATE = "update"
export const EVENT_ZOOM = "zoom"

export const IS_DETACH_ALLOWED = "isDetachAllowed"

export const INTERCEPT_BEFORE_DRAG = "beforeDrag"
export const INTERCEPT_BEFORE_DROP = "beforeDrop"
export const INTERCEPT_BEFORE_DETACH = "beforeDetach"
export const INTERCEPT_BEFORE_START_DETACH = "beforeStartDetach"

export const PROPERTY_POSITION = "position"

export const SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR)
export const SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT)
export const SELECTOR_GROUP = att(ATTRIBUTE_GROUP)
export const SELECTOR_GROUP_CONTAINER = att(ATTRIBUTE_GROUP_CONTENT)
export const SELECTOR_MANAGED_ELEMENT = att(ATTRIBUTE_MANAGED)
export const SELECTOR_OVERLAY = cls(CLASS_OVERLAY)


