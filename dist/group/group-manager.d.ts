import { Dictionary, jsPlumbInstance, Offset } from "../core";
import { UIGroup } from "./group";
import { jsPlumbDOMElement } from "..";
export declare class GroupManager {
    instance: jsPlumbInstance;
    groupMap: Dictionary<UIGroup>;
    _connectionSourceMap: Dictionary<UIGroup>;
    _connectionTargetMap: Dictionary<UIGroup>;
    constructor(instance: jsPlumbInstance);
    private _cleanupDetachedConnection;
    addGroup(params: {
        id: string;
        el: jsPlumbDOMElement;
        collapsed?: boolean;
    }): UIGroup;
    getGroup(groupId: string | UIGroup): UIGroup;
    getGroupFor(el: any | string): UIGroup;
    getGroups(): Array<UIGroup>;
    removeGroup(group: string | UIGroup, deleteMembers?: boolean, manipulateDOM?: boolean, doNotFireEvent?: boolean): Dictionary<Offset>;
    removeAllGroups(deleteMembers?: boolean, manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    forEach(f: (g: UIGroup) => any): void;
    orphan(_el: jsPlumbDOMElement): [string, Offset];
    private _setGroupVisible;
    _updateConnectionsForGroup(group: UIGroup): void;
    private _collapseConnection;
    private _expandConnection;
    private isElementDescendant;
    collapseGroup(group: string | UIGroup): void;
    /**
     * Cascade a collapse from the given `collapsedGroup` into the given `targetGroup`.
     * @param collapsedGroup
     * @param targetGroup
     * @param collapsedIds Set of connection ids for already collapsed connections, which we can ignore.
     */
    cascadeCollapse(collapsedGroup: UIGroup, targetGroup: UIGroup, collapsedIds: Set<string>): void;
    expandGroup(group: string | UIGroup, doNotFireEvent?: boolean): void;
    /**
     * Cascade an expand from the given `collapsedGroup` into the given `targetGroup`.
     * @param expandedGroup
     * @param targetGroup
     */
    cascadeExpand(expandedGroup: UIGroup, targetGroup: UIGroup): void;
    toggleGroup(group: string | UIGroup): void;
    repaintGroup(group: string | UIGroup): void;
    addToGroup(group: string | UIGroup, el: any | Array<any>, doNotFireEvent?: boolean): void;
    removeFromGroup(group: string | UIGroup, el: any, doNotFireEvent?: boolean): void;
    getAncestors(group: UIGroup): Array<UIGroup>;
    isAncestor(group: UIGroup, possibleAncestor: UIGroup): boolean;
    getDescendants(group: UIGroup): Array<UIGroup>;
    isDescendant(possibleDescendant: UIGroup, ancestor: UIGroup): boolean;
    reset(): void;
}
