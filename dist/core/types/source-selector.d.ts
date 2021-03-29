import { SourceDefinition, SourceOrTargetDefinition, TargetDefinition } from "./common";
export declare class ConnectionDragSelector {
    selector: string;
    protected def: SourceOrTargetDefinition;
    exclude: boolean;
    constructor(selector: string, def: SourceOrTargetDefinition, exclude?: boolean);
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
}
export declare class SourceSelector extends ConnectionDragSelector {
    def: SourceDefinition;
    constructor(selector: string, def: SourceDefinition, exclude: boolean);
}
export declare class TargetSelector extends ConnectionDragSelector {
    def: TargetDefinition;
    constructor(selector: string, def: TargetDefinition, exclude: boolean);
}
