import { DragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint-impl";
import { Dictionary } from "../core";
import { EndpointRepresentation } from "../endpoint/endpoints";
export declare class EndpointDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    jpc: Connection;
    existingJpc: boolean;
    ep: Endpoint;
    endpointRepresentation: EndpointRepresentation<any>;
    existingJpcParams: any;
    placeholderInfo: any;
    floatingElement: HTMLElement;
    floatingEndpoint: Endpoint;
    _stopped: boolean;
    inPlaceCopy: any;
    endpointDropTargets: Array<any>;
    currentDropTarget: any;
    payload: any;
    floatingConnections: Dictionary<Connection>;
    _forceReattach: boolean;
    _forceDetach: boolean;
    _mousedownHandler: (e: any) => void;
    _mouseupHandler: (e: any) => void;
    constructor(instance: BrowserJsPlumbInstance);
    _makeDraggablePlaceholder(ipco: any, ips: any): HTMLElement;
    _cleanupDraggablePlaceholder(): void;
    reset(): void;
    init(katavorioDraggable: any): void;
    selector: string;
    onStart(p: any): boolean;
    onBeforeStart(beforeStartParams: any): void;
    onDrag(params: any): boolean;
    maybeCleanup(ep: Endpoint): void;
    private _reattachOrDiscard;
    onStop(p: any): void;
    /**
     * Lookup a source definition on the given element.
     * @param fromElement Element to lookup the source definition
     * @param evt Associated mouse event - for instance, the event that started a drag.
     * @param ignoreFilter Used when we're getting a source definition to possibly use as a drop target, ie. when a
     * connection's source endpoint is being dragged. in that scenario we don't want to filter - we want the source to basically
     * behave as a target.
     * @private
     */
    private _getSourceDefinition;
    private _getTargetDefinition;
    _getDropEndpoint(p: any, jpc: Connection): Endpoint;
    _doForceReattach(idx: number): void;
    _shouldReattach(originalEvent?: Event): boolean;
    _maybeReattach(idx: number, originalEvent?: Event): void;
    private _discard;
    private _drop;
    _registerFloatingConnection(info: any, conn: Connection, ep: Endpoint): void;
    getFloatingAnchorIndex(jpc: Connection): number;
}
