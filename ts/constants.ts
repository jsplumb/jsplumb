function cls(className:string):string { return  "." + className; }

export const SOURCE_DEFINITION_LIST = "_jsPlumbSourceDefinitions";
export const TARGET_DEFINITION_LIST = "_jsPlumbTargetDefinitions";
export const DEFAULT = "default";
export const WILDCARD = "*";
export const SOURCE = "source";
export const TARGET = "target";
export const BLOCK = "block";
export const NONE = "none";
export const SOURCE_INDEX = 0;
export const TARGET_INDEX = 1;
export const GROUP_KEY = "_jsPlumbGroup";
export const IS_GROUP_KEY = "_isJsPlumbGroup";

export const ATTRIBUTE_MANAGED = "jtk-managed";
export const ATTRIBUTE_GROUP = "jtk-group";
export const ATTRIBUTE_SOURCE = "jtk-source";
export const ATTRIBUTE_TARGET = "jtk-target";
export const ATTRIBUTE_CONTAINER = "jtk-container";

export const IS_DETACH_ALLOWED = "isDetachAllowed";
export const BEFORE_DETACH = "beforeDetach";
export const CHECK_CONDITION = "checkCondition";

export const EVENT_CONNECTION = "connection";
export const EVENT_CONNECTION_DETACHED = "connectionDetached";
export const EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connectionDetached";
export const EVENT_CONNECTION_MOVED = "connectionMoved";
export const EVENT_CONTAINER_CHANGE = "container:change";

export const EVENT_CHILD_ADDED = "group:addMember";
export const EVENT_CHILD_REMOVED = "group:removeMember";
export const EVENT_GROUP_ADDED = "group:add";
export const EVENT_GROUP_REMOVED = "group:remove";
export const EVENT_EXPAND = "group:expand";
export const EVENT_COLLAPSE = "group:collapse";
export const EVENT_GROUP_DRAG_STOP = "groupDragStop";

export const CLASS_CONNECTOR = "jtk-connector";
export const CLASS_ENDPOINT = "jtk-endpoint";
export const CLASS_OVERLAY = "jtk-overlay";
export const GROUP_COLLAPSED_CLASS = "jtk-group-collapsed";
export const GROUP_EXPANDED_CLASS = "jtk-group-expanded";

export const CMD_REMOVE_ALL = "removeAll";
export const CMD_ORPHAN_ALL = "orphanAll";
export const CMD_SHOW = "show";
export const CMD_HIDE = "hide";

export const SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR);
export const SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT);
export const SELECTOR_OVERLAY = cls(CLASS_OVERLAY);
export const SELECTOR_GROUP_CONTAINER = "[jtk-group-content]";


