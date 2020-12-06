import { BrowserJsPlumbInstance, jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Dictionary } from '../core/common';
import { Anchor } from '../core/anchor/anchor';
import { AnchorSpec } from '../core/factory/anchor-factory';
import { Connection } from '../core/connector/connection-impl';
import { Endpoint } from '../core/endpoint/endpoint-impl';
import { EndpointSpec } from '../core/endpoint/endpoint';
export interface ListManagerOptions {
}
export interface jsPlumbListOptions {
    anchor?: AnchorSpec;
    deriveAnchor?: (edge: string, index: number, ep: Endpoint, conn: Connection) => Anchor;
    endpoint?: EndpointSpec;
    deriveEndpoint?: (edge: string, index: number, ep: Endpoint, conn: Connection) => Endpoint;
}
export declare class jsPlumbListManager {
    private instance;
    options: ListManagerOptions;
    count: number;
    lists: Dictionary<jsPlumbList>;
    constructor(instance: BrowserJsPlumbInstance, params?: ListManagerOptions);
    addList(el: jsPlumbDOMElement, options?: jsPlumbListOptions): jsPlumbList;
    removeList(el: jsPlumbDOMElement): void;
    _maybeUpdateParentList(el: jsPlumbDOMElement): void;
}
export declare class jsPlumbList {
    private instance;
    private el;
    private options;
    _scrollHandler: Function;
    constructor(instance: BrowserJsPlumbInstance, el: jsPlumbDOMElement, options: jsPlumbListOptions, id: string);
    private deriveAnchor;
    deriveEndpoint(edge: string, index: number, ep: Endpoint, conn: Connection): string | Endpoint | [string, any];
    scrollHandler(): void;
    destroy(): void;
}
