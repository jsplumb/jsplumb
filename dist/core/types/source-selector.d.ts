import { SourceOrTargetDefinition } from "./type-descriptors";
export declare class ConnectionDragSelector {
    selector: string;
    def: SourceOrTargetDefinition;
    exclude: boolean;
    readonly id: string;
    redrop: RedropPolicy;
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
export declare const REDROP_POLICY_ANY_SOURCE = "anySource";
export declare const REDROP_POLICY_ANY_TARGET = "anyTarget";
export declare const REDROP_POLICY_ANY_SOURCE_OR_TARGET = "anySourceOrTarget";
/**
 * Defines how redrop of source endpoints can be done.
 */
export declare type RedropPolicy = typeof REDROP_POLICY_STRICT | typeof REDROP_POLICY_ANY | typeof REDROP_POLICY_ANY_SOURCE | typeof REDROP_POLICY_ANY_TARGET | typeof REDROP_POLICY_ANY_SOURCE_OR_TARGET;
//# sourceMappingURL=source-selector.d.ts.map