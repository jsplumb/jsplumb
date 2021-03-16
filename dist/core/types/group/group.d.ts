import { Dictionary, PointXY } from '../common';
import { JsPlumbInstance } from "../core";
import { Connection } from '../connector/connection-impl';
import { AnchorSpec } from "../factory/anchor-factory";
import { EndpointSpec } from "../endpoint/endpoint";
import { GroupManager } from "../group/group-manager";
export interface GroupOptions {
    id?: string;
    droppable?: boolean;
    enabled?: boolean;
    orphan?: boolean;
    constrain?: boolean;
    proxied?: boolean;
    ghost?: boolean;
    revert?: boolean;
    prune?: boolean;
    dropOverride?: boolean;
    anchor?: AnchorSpec;
    endpoint?: EndpointSpec;
}
export declare class UINode<E> {
    instance: JsPlumbInstance;
    el: E;
    group: UIGroup<E>;
    constructor(instance: JsPlumbInstance, el: E);
}
export declare class UIGroup<E = any> extends UINode<E> {
    instance: JsPlumbInstance;
    children: Array<UINode<E>>;
    collapsed: boolean;
    droppable: boolean;
    enabled: boolean;
    orphan: boolean;
    constrain: boolean;
    proxied: boolean;
    ghost: boolean;
    revert: boolean;
    prune: boolean;
    dropOverride: boolean;
    anchor: AnchorSpec;
    endpoint: EndpointSpec;
    readonly connections: {
        source: Array<Connection>;
        target: Array<Connection>;
        internal: Array<Connection>;
    };
    manager: GroupManager<E>;
    id: string;
    readonly elId: string;
    constructor(instance: JsPlumbInstance, el: E, options: GroupOptions);
    overrideDrop(el: any, targetGroup: UIGroup<E>): boolean;
    getContentArea(): any;
    getAnchor(conn: Connection, endpointIndex: number): AnchorSpec;
    getEndpoint(conn: Connection, endpointIndex: number): EndpointSpec;
    add(_el: E, doNotFireEvent?: boolean): void;
    private resolveNode;
    remove(el: E, manipulateDOM?: boolean, doNotFireEvent?: boolean, doNotUpdateConnections?: boolean, targetGroup?: UIGroup<E>): void;
    private _doRemove;
    removeAll(manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    orphanAll(): Dictionary<PointXY>;
    addGroup(group: UIGroup<E>): boolean;
    removeGroup(group: UIGroup<E>): void;
    getGroups(): Array<UIGroup<E>>;
    getNodes(): Array<UINode<E>>;
    readonly collapseParent: UIGroup<E>;
}
