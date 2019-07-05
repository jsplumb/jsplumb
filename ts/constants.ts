function cls(className:string):string { return  "." + className; }

export const SOURCE_DEFINITION_LIST = "_jsPlumbSourceDefinitions";
export const TARGET_DEFINITION_LIST = "_jsPlumbTargetDefinitions";
export const DEFAULT = "default";
export const WILDCARD = "*";
export const SOURCE = "source";
export const TARGET = "target";
export const SOURCE_INDEX = 0;
export const TARGET_INDEX = 1;
export const GROUP_KEY = "_jsPlumbGroup";

export const ATTRIBUTE_MANAGED = "jtk-managed";
export const ATTRIBUTE_GROUP = "jtk-group";
export const ATTRIBUTE_SOURCE = "jtk-source";
export const ATTRIBUTE_TARGET = "jtk-target";
export const ATTRIBUTE_CONTAINER = "jtk-container";

export const IS_DETACH_ALLOWED = "isDetachAllowed";
export const BEFORE_DETACH = "beforeDetach";
export const CHECK_CONDITION = "checkCondition";

export const EVENT_CONNECTION_DETACHED = "connectionDetached";
export const EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connectionDetached";
export const EVENT_CONNECTION_MOVED = "connectionMoved";
export const EVENT_CONTAINER_CHANGE = "container:change";

export const CLASS_CONNECTOR = "jtk-connector";
export const CLASS_ENDPOINT = "jtk-endpoint";
export const CLASS_OVERLAY = "jtk-overlay";

export const SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR);
export const SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT);
export const SELECTOR_OVERLAY = cls(CLASS_OVERLAY);


