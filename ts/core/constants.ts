
export function cls(...className:Array<string>):string {
    return  className.map((cn:string) => "." + cn).join(",")
}

export function classList(...className:Array<string>):string {
    return className.join(" ")
}

export function att(...attName:Array<string>):string {
    return attName.map((an:string) => "[" + an + "]").join(",")
}

export const SOURCE = "source"
export const TARGET = "target"
export const BLOCK = "block"
export const NONE = "none"
export const SOURCE_INDEX = 0
export const TARGET_INDEX = 1

export const ABSOLUTE = "absolute"
export const FIXED = "fixed"
export const STATIC = "static"

export const ATTRIBUTE_GROUP = "data-jtk-group"

export const ATTRIBUTE_MANAGED = "data-jtk-managed"
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
export const CLASS_ENDPOINT_FLOATING = "jtk-floating-endpoint"
export const CLASS_ENDPOINT_DROP_ALLOWED = "jtk-endpoint-drop-allowed"
export const CLASS_ENDPOINT_DROP_FORBIDDEN = "jtk-endpoint-drop-forbidden"
export const CLASS_ENDPOINT_ANCHOR_PREFIX = "jtk-endpoint-anchor"

export const CLASS_GROUP_COLLAPSED = "jtk-group-collapsed"
export const CLASS_GROUP_EXPANDED = "jtk-group-expanded"
export const CLASS_OVERLAY = "jtk-overlay"

export const EVENT_ANCHOR_CHANGED = "anchor:changed"
export const EVENT_CONNECTION = "connection"
export const EVENT_INTERNAL_CONNECTION = "internal.connection"
export const EVENT_CONNECTION_DETACHED = "connection:detach"
export const EVENT_CONNECTION_MOVED = "connection:move"

export const EVENT_CONTAINER_CHANGE = "container:change"

export const EVENT_ENDPOINT_REPLACED = "endpoint:replaced"
export const EVENT_INTERNAL_ENDPOINT_UNREGISTERED = "internal.endpoint:unregistered"
export const EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connection:detached"
export const EVENT_MANAGE_ELEMENT = "element:manage"

export const EVENT_GROUP_ADDED = "group:added"
export const EVENT_GROUP_COLLAPSE = "group:collapse"
export const EVENT_GROUP_EXPAND = "group:expand"
export const EVENT_GROUP_MEMBER_ADDED = "group:member:added"
export const EVENT_GROUP_MEMBER_REMOVED = "group:member:removed"
export const EVENT_GROUP_REMOVED = "group:removed"
export const EVENT_MAX_CONNECTIONS = "maxConnections"
export const EVENT_NESTED_GROUP_ADDED = "group:nested:added"
export const EVENT_NESTED_GROUP_REMOVED = "group:nested:removed"
export const EVENT_UNMANAGE_ELEMENT = "element:unmanage"
export const EVENT_ZOOM = "zoom"

export const IS_DETACH_ALLOWED = "isDetachAllowed"

export const INTERCEPT_BEFORE_DRAG = "beforeDrag"
export const INTERCEPT_BEFORE_DROP = "beforeDrop"
export const INTERCEPT_BEFORE_DETACH = "beforeDetach"
export const INTERCEPT_BEFORE_START_DETACH = "beforeStartDetach"

export const SELECTOR_MANAGED_ELEMENT = att(ATTRIBUTE_MANAGED)

export const ERROR_SOURCE_ENDPOINT_FULL = "Cannot establish connection: source endpoint is full"
export const ERROR_TARGET_ENDPOINT_FULL = "Cannot establish connection: target endpoint is full"
export const ERROR_SOURCE_DOES_NOT_EXIST = "Cannot establish connection: source does not exist"
export const ERROR_TARGET_DOES_NOT_EXIST = "Cannot establish connection: target does not exist"

export const KEY_CONNECTION_OVERLAYS = "connectionOverlays"


