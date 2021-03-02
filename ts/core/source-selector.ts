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

export class SourceSelector extends ConnectionDragSelector {
    constructor(selector:string, public def:SourceDefinition, exclude:boolean) {
        super(selector, def, exclude)
    }
}
export class TargetSelector extends ConnectionDragSelector {
    constructor(selector:string, public def:TargetDefinition, exclude:boolean) {
        super(selector, def, exclude)
    }
}
