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
 * @public
 */
export declare const REDROP_POLICY_STRICT = "strict";
/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto some other source element by
 * dropping it anywhere on that element.
 * @public
 */
export declare const REDROP_POLICY_ANY = "any";
/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto any other source element, by dropping
 * it anywhere on a source element. But it cannot be dropped onto any target element. This flag is equivalent to `REDROP_POLICY_ANY` but with the
 * stipulation that the element on which the connections is being dropped must itself be configured with one or more source selectors.
 * @public
 */
export declare const REDROP_POLICY_ANY_SOURCE = "anySource";
/**
 * Indicates that when dragging an existing connection by its target endpoint, it can be relocated onto any other target element, by dropping
 * it anywhere on a target element. But it cannot be dropped onto any source element. This flag is equivalent to `REDROP_POLICY_ANY` but with the
 * stipulation that the element on which the connections is being dropped must itself be configured with one or more target selectors.
 * @public
 */
export declare const REDROP_POLICY_ANY_TARGET = "anyTarget";
/**
 * This flag is the union of REDROP_POLICY_ANY_TARGET and REDROP_POLICY_ANY_SOURCE
 * @public
 */
export declare const REDROP_POLICY_ANY_SOURCE_OR_TARGET = "anySourceOrTarget";
/**
 * Defines how redrop of source endpoints can be done.
 * @public
 */
export declare type RedropPolicy = typeof REDROP_POLICY_STRICT | typeof REDROP_POLICY_ANY | typeof REDROP_POLICY_ANY_SOURCE | typeof REDROP_POLICY_ANY_TARGET | typeof REDROP_POLICY_ANY_SOURCE_OR_TARGET;
//# sourceMappingURL=source-selector.d.ts.map