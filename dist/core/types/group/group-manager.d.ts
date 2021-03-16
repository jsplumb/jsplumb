import { Dictionary, PointXY } from '../common';
import { JsPlumbInstance } from "../core";
import { UIGroup, GroupOptions } from "./group";
export interface GroupCollapsedParams<E> {
    group: UIGroup<E>;
}
export interface GroupExpandedParams<E> {
    group: UIGroup<E>;
}
export interface AddGroupOptions<E> extends GroupOptions {
    el: E;
    collapsed?: boolean;
}
export declare class GroupManager<E> {
    instance: JsPlumbInstance;
    groupMap: Dictionary<UIGroup<E>>;
    _connectionSourceMap: Dictionary<UIGroup<E>>;
    _connectionTargetMap: Dictionary<UIGroup<E>>;
    constructor(instance: JsPlumbInstance);
    private _cleanupDetachedConnection;
    addGroup(params: AddGroupOptions<E>): UIGroup<E>;
    getGroup(groupId: string | UIGroup<E>): UIGroup<E>;
    getGroupFor(el: E): UIGroup<E>;
    getGroups(): Array<UIGroup<E>>;
    removeGroup(group: string | UIGroup<E>, deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): Dictionary<PointXY>;
    removeAllGroups(deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): void;
    forEach(f: (g: UIGroup<E>) => any): void;
    orphan(el: E): [string, PointXY];
    private _setGroupVisible;
    _updateConnectionsForGroup(group: UIGroup<E>): void;
    private _collapseConnection;
    private _expandConnection;
    private isElementDescendant;
    collapseGroup(group: string | UIGroup<E>): void;
    /**
     * Cascade a collapse from the given `collapsedGroup` into the given `targetGroup`.
     * @param collapsedGroup
     * @param targetGroup
     * @param collapsedIds Set of connection ids for already collapsed connections, which we can ignore.
     */
    cascadeCollapse(collapsedGroup: UIGroup<E>, targetGroup: UIGroup<E>, collapsedIds: Set<string>): void;
    expandGroup(group: string | UIGroup<E>, doNotFireEvent?: boolean): void;
    /**
     * Cascade an expand from the given `collapsedGroup` into the given `targetGroup`.
     * @param expandedGroup
     * @param targetGroup
     */
    cascadeExpand(expandedGroup: UIGroup<E>, targetGroup: UIGroup<E>): void;
    toggleGroup(group: string | UIGroup<E>): void;
    repaintGroup(group: string | UIGroup<E>): void;
    addToGroup(group: string | UIGroup<E>, doNotFireEvent: boolean, ...el: Array<E>): void;
    removeFromGroup(group: string | UIGroup<E>, doNotFireEvent: boolean, ...el: Array<E>): void;
    getAncestors(group: UIGroup<E>): Array<UIGroup<E>>;
    isAncestor(group: UIGroup<E>, possibleAncestor: UIGroup<E>): boolean;
    getDescendants(group: UIGroup<E>): Array<UIGroup<E>>;
    isDescendant(possibleDescendant: UIGroup<E>, ancestor: UIGroup<E>): boolean;
    reset(): void;
}
