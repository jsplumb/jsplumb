import {SourceDefinition, SourceOrTargetDefinition, TargetDefinition} from "./common"

export class ConnectionDragSelector {

    constructor(public selector:string, protected def:SourceOrTargetDefinition, public exclude = false) { }

    setEnabled(enabled:boolean) {
        this.def.enabled = enabled
    }

    isEnabled():boolean {
        return this.def.enabled !== false
    }
}

/**
 * Indicates that when dragging an existing connection by its source endpoint, it can only be relocated onto some other source element by
 * dropping it on the part of that element defined by its source selector.
 */
export const REDROP_POLICY_STRICT = "strict"
/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto some other source element by
 * dropping it anywhere on that element.
 */
export const REDROP_POLICY_ANY = "any"
/**
 * Defines how redrop of source endpoints can be done.
 */
export type RedropPolicy = typeof REDROP_POLICY_STRICT | typeof REDROP_POLICY_ANY

export class SourceSelector extends ConnectionDragSelector {
    redrop:RedropPolicy
    constructor(selector:string, public def:SourceDefinition, exclude:boolean) {
        super(selector, def, exclude)
        this.redrop = def.def.redrop || REDROP_POLICY_STRICT
    }
}

export class TargetSelector extends ConnectionDragSelector {
    constructor(selector:string, public def:TargetDefinition, exclude:boolean) {
        super(selector, def, exclude)
    }
}
