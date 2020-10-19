export function cls(...className:Array<string>):string {
    return  className.map((cn:string) => "." + cn).join(",")
}

export function classList(...className:Array<string>):string {
    return className.join(" ")
}

export const SOURCE_DEFINITION_LIST = "_jsPlumbSourceDefinitions"
export const TARGET_DEFINITION_LIST = "_jsPlumbTargetDefinitions"
export const DEFAULT = "default"
export const WILDCARD = "*"
export const SOURCE = "source"
export const TARGET = "target"
export const BLOCK = "block"
export const NONE = "none"
export const SOURCE_INDEX = 0
export const TARGET_INDEX = 1

export const GROUP_KEY = "_jsPlumbGroup"
export const PARENT_GROUP_KEY = "_jsPlumbParentGroup"
export const IS_GROUP_KEY = "_isJsPlumbGroup"

export const ATTRIBUTE_MANAGED = "jtk-managed"
export const ATTRIBUTE_GROUP = "jtk-group"
export const ATTRIBUTE_SOURCE = "jtk-source"
export const ATTRIBUTE_TARGET = "jtk-target"
export const ATTRIBUTE_CONTAINER = "jtk-container"
export const ATTRIBUTE_NOT_DRAGGABLE = "jtk-not-draggable"
export const ATTRIBUTE_TABINDEX = "tabindex"

export const CHECK_DROP_ALLOWED = "checkDropAllowed"
export const IS_DETACH_ALLOWED = "isDetachAllowed"
export const BEFORE_DETACH = "beforeDetach"
export const CHECK_CONDITION = "checkCondition"

export const EVENT_CONNECTION = "connection"
export const EVENT_CONNECTION_DETACHED = "connectionDetached"
export const EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connectionDetached"
export const EVENT_CONNECTION_MOVED = "connectionMoved"
export const EVENT_CONTAINER_CHANGE = "container:change"
export const EVENT_CLICK = "click"
export const EVENT_DBL_CLICK = "dblclick"
export const EVENT_CONNECTION_MOUSEOVER = "connectionMouseOver"
export const EVENT_CONNECTION_MOUSEOUT = "connectionMouseOut"
export const EVENT_ENDPOINT_CLICK = "endpointClick"
export const EVENT_ENDPOINT_DBL_CLICK = "endpointDblClick"
export const EVENT_ENDPOINT_MOUSEOVER = "endpointMouseOver"
export const EVENT_ENDPOINT_MOUSEOUT = "endpointMouseOut"
export const EVENT_ELEMENT_CLICK = "elementClick"
export const EVENT_ELEMENT_DBL_CLICK = "elementDblClick"
export const EVENT_ELEMENT_MOUSE_MOVE = "elementMousemove"
export const EVENT_ELEMENT_MOUSE_OVER = "elementMouseover"
export const EVENT_ELEMENT_MOUSE_OUT = "elementMouseout"
export const EVENT_FOCUS = "focus"
export const EVENT_MOUSEOVER = "mouseover"
export const EVENT_MOUSEOUT = "mouseout"
export const EVENT_MOUSEMOVE = "mousemove"
export const EVENT_MOUSEENTER = "mouseenter"
export const EVENT_MOUSEEXIT= "mouseexit"
export const EVENT_TAP = "tap"
export const EVENT_DBL_TAP = "dbltap"
export const EVENT_CONTEXTMENU = "contextmenu"
export const EVENT_MOUSEUP = "mouseup"
export const EVENT_MOUSEDOWN = "mousedown"

export const EVENT_CONNECTION_DRAG = "connectionDrag"

export const EVENT_GROUP_MEMBER_ADDED = "group:addMember"
export const EVENT_GROUP_MEMBER_REMOVED = "group:removeMember"
export const EVENT_GROUP_ADDED = "group:add"
export const EVENT_GROUP_REMOVED = "group:remove"
export const EVENT_EXPAND = "group:expand"
export const EVENT_COLLAPSE = "group:collapse"
export const EVENT_GROUP_DRAG_STOP = "groupDragStop"
export const EVENT_NESTED_GROUP_REMOVED = "nestedGroupRemoved"
export const EVENT_NESTED_GROUP_ADDED = "nestedGroupAdded"

export const EVENT_MAX_CONNECTIONS = "maxConnections"

export const EVENT_ZOOM = "zoom"

export const CLASS_CONNECTOR = "jtk-connector"
export const CLASS_ENDPOINT = "jtk-endpoint"
export const CLASS_OVERLAY = "jtk-overlay"
export const GROUP_COLLAPSED_CLASS = "jtk-group-collapsed"
export const GROUP_EXPANDED_CLASS = "jtk-group-expanded"

export const CMD_REMOVE_ALL = "removeAll"
export const CMD_ORPHAN_ALL = "orphanAll"
export const CMD_SHOW = "show"
export const CMD_HIDE = "hide"

export const SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR)
export const SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT)
export const SELECTOR_OVERLAY = cls(CLASS_OVERLAY)
export const SELECTOR_GROUP_CONTAINER = "[jtk-group-content]"
export const SELECTOR_MANAGED_ELEMENT = "[jtk-managed]"


