import { SourceDefinition, SourceOrTargetDefinition, TargetDefinition } from "./type-descriptors";
export declare class ConnectionDragSelector {
    selector: string;
    protected def: SourceOrTargetDefinition;
    exclude: boolean;
    constructor(selector: string, def: SourceOrTargetDefinition, exclude?: boolean);
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
}
/**
 * Indicates that when dragging an existing connection by its source endpoint, it can only be relocated onto some other source element by
 * dropping it on the part of that element defined by its source selector.
 */
export declare const REDROP_POLICY_STRICT = "strict";
/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto some other source element by
 * dropping it anywhere on that element.
 */
export declare const REDROP_POLICY_ANY = "any";
/**
 * Defines how redrop of source endpoints can be done.
 */
export declare type RedropPolicy = typeof REDROP_POLICY_STRICT | typeof REDROP_POLICY_ANY;
export declare class SourceSelector extends ConnectionDragSelector {
    def: SourceDefinition;
    redrop: RedropPolicy;
    constructor(selector: string, def: SourceDefinition, exclude: boolean);
}
export declare class TargetSelector extends ConnectionDragSelector {
    def: TargetDefinition;
    constructor(selector: string, def: TargetDefinition, exclude: boolean);
}
