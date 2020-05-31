import { jsPlumbInstance } from "../core";
import { AnchorSpec, Connection, EndpointSpec, GroupManager } from "..";
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
export declare class UIGroup<E> {
    instance: jsPlumbInstance<E>;
    children: Array<E>;
    el: E;
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
        source: Array<Connection<E>>;
        target: Array<Connection<E>>;
        internal: Array<Connection<E>>;
    };
    groups: Array<UIGroup<E>>;
    manager: GroupManager<E>;
    id: string;
    constructor(instance: jsPlumbInstance<E>, el: E, options: GroupOptions);
    overrideDrop(el: E, targetGroup: UIGroup<E>): boolean;
    getDragArea(): E;
    getAnchor(conn: Connection<E>, endpointIndex: number): AnchorSpec;
    getEndpoint(conn: Connection<E>, endpointIndex: number): EndpointSpec;
    add(_el: E, doNotFireEvent?: boolean): void;
    remove(el: E | Array<E>, manipulateDOM?: boolean, doNotFireEvent?: boolean, doNotUpdateConnections?: boolean, targetGroup?: UIGroup<E>): void;
    removeAll(manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    private _orphan;
    orphanAll(): {};
}
