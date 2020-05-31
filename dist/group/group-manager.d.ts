import { Dictionary, jsPlumbInstance } from "../core";
import { UIGroup } from "./group";
export declare class GroupManager<E> {
    instance: jsPlumbInstance<E>;
    groupMap: Dictionary<UIGroup<E>>;
    _connectionSourceMap: Dictionary<UIGroup<E>>;
    _connectionTargetMap: Dictionary<UIGroup<E>>;
    constructor(instance: jsPlumbInstance<E>);
    private _cleanupDetachedConnection;
    addGroup(params: any): UIGroup<E>;
    getGroup(groupId: string | UIGroup<E>): UIGroup<E>;
    getGroupFor(el: E | string): UIGroup<E>;
    removeGroup(group: string | UIGroup<E>, deleteMembers?: boolean, manipulateDOM?: boolean, doNotFireEvent?: boolean): void | {};
    removeAllGroups(deleteMembers?: boolean, manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    forEach(f: (g: UIGroup<E>) => any): void;
    orphan(_el: E): (string | import("..").Offset)[];
    private _setGroupVisible;
    _updateConnectionsForGroup(group: UIGroup<E>): void;
    private _collapseConnection;
    private _expandConnection;
    private isDescendant;
    collapseGroup(group: string | UIGroup<E>): void;
    expandGroup(group: string | UIGroup<E>, doNotFireEvent?: boolean): void;
    toggleGroup(group: string | UIGroup<E>): void;
    repaintGroup(group: string | UIGroup<E>): void;
    addToGroup(group: string | UIGroup<E>, el: E | Array<E>, doNotFireEvent?: boolean): void;
    removeFromGroup(group: string | UIGroup<E>, el: E, doNotFireEvent?: boolean): void;
    reset(): void;
}
