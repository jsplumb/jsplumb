import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { EndpointSpec, Endpoint, Connection, AnchorSpec, Anchor, Dictionary } from '@jsplumb/community-core';
export interface ListManagerOptions {
}
export interface jsPlumbListOptions {
    anchor?: AnchorSpec;
    deriveAnchor?: (edge: string, index: number, ep: Endpoint, conn: Connection) => Anchor;
    endpoint?: EndpointSpec;
    deriveEndpoint?: (edge: string, index: number, ep: Endpoint, conn: Connection) => Endpoint;
}
export declare class jsPlumbListManager<E> {
    private instance;
    options: ListManagerOptions;
    count: number;
    lists: Dictionary<jsPlumbList>;
    constructor(instance: BrowserJsPlumbInstance, params?: ListManagerOptions);
    addList(el: Element, options?: jsPlumbListOptions): jsPlumbList;
    removeList(el: Element): void;
    private _maybeUpdateParentList;
}
export declare class jsPlumbList {
    private instance;
    private el;
    private options;
    _scrollHandler: Function;
    private readonly domElement;
    constructor(instance: BrowserJsPlumbInstance, el: Element, options: jsPlumbListOptions, id: string);
    private deriveAnchor;
    deriveEndpoint(edge: string, index: number, ep: Endpoint, conn: Connection): string | Endpoint<any> | [string, any];
    scrollHandler(): void;
    destroy(): void;
}
