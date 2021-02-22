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
    el: any;
    group: UIGroup<E>;
    constructor(instance: JsPlumbInstance, el: any);
}
export declare class UIGroup<E = any> extends UINode<E> {
    instance: JsPlumbInstance;
    children: Array<E>;
    childGroups: Array<UIGroup<E>>;
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
    connections: {
        source: Array<Connection>;
        target: Array<Connection>;
        internal: Array<Connection>;
    };
    groups: Array<UIGroup<E>>;
    manager: GroupManager<E>;
    id: string;
    readonly elId: string;
    constructor(instance: JsPlumbInstance, el: E, options: GroupOptions);
    overrideDrop(el: any, targetGroup: UIGroup<E>): boolean;
    getContentArea(): any;
    getAnchor(conn: Connection, endpointIndex: number): AnchorSpec;
    getEndpoint(conn: Connection, endpointIndex: number): EndpointSpec;
    add(_el: any, doNotFireEvent?: boolean): void;
    remove(el: E | Array<E>, manipulateDOM?: boolean, doNotFireEvent?: boolean, doNotUpdateConnections?: boolean, targetGroup?: UIGroup<E>): void;
    removeAll(manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    orphanAll(): Dictionary<PointXY>;
    addGroup(group: UIGroup<E>): boolean;
    removeGroup(group: UIGroup<E>): void;
    getGroups(): Array<UIGroup<E>>;
    readonly collapseParent: UIGroup<E>;
}
