import { DragEventParams, DragHandler, DragStartEventParams, DragStopEventParams } from "./drag-manager";
import { BrowserJsPlumbInstance, jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint-impl";
import { BoundingBox, Dictionary } from "../core";
import { EndpointRepresentation } from "../endpoint/endpoints";
import { Drag } from "./collicat";
export interface ConnectionMovedParams {
    connection: Connection;
    index: number;
    originalSourceId: string;
    newSourceId: string;
    originalTargetId: string;
    newTargetId: string;
    originalSourceEndpoint: Endpoint;
    newSourceEndpoint: Endpoint;
    originalTargetEndpoint: Endpoint;
    newTargetEndpoint: Endpoint;
}
export declare class EndpointDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    jpc: Connection;
    existingJpc: boolean;
    ep: Endpoint;
    endpointRepresentation: EndpointRepresentation<any>;
    existingJpcParams: any;
    placeholderInfo: {
        id?: string;
        element?: jsPlumbDOMElement;
    };
    floatingElement: HTMLElement;
    floatingEndpoint: Endpoint;
    _stopped: boolean;
    inPlaceCopy: any;
    endpointDropTargets: Array<{
        el: jsPlumbDOMElement;
        endpoint: Endpoint;
        r: BoundingBox;
    }>;
    currentDropTarget: any;
    payload: any;
    floatingConnections: Dictionary<Connection>;
    _forceReattach: boolean;
    _forceDetach: boolean;
    mousedownHandler: (e: any) => void;
    mouseupHandler: (e: any) => void;
    selector: string;
    constructor(instance: BrowserJsPlumbInstance);
    private _mousedownHandler;
    private _mouseupHandler;
    /**
     * At the beginning of a drag, this method can be used to perform some setup in a handler, and if it returns a DOM
     * element, that element will be the one used for dragging.
     * @param el The element that will be dragged unless we return something different.
     */
    onDragInit(el: jsPlumbDOMElement): jsPlumbDOMElement;
    onDragAbort(el: jsPlumbDOMElement): void;
    /**
     * Makes the element that is the placeholder for dragging. this element gets `managed` by the instance, and `unmanaged` when dragging
     * ends.
     * @param ipco
     * @param ips
     * @private
     */
    private _makeDraggablePlaceholder;
    private _cleanupDraggablePlaceholder;
    reset(): void;
    init(drag: Drag): void;
    onStart(p: DragStartEventParams): boolean;
    onBeforeStart(beforeStartParams: any): void;
    onDrag(params: DragEventParams): boolean;
    private _maybeCleanup;
    private _reattachOrDiscard;
    onStop(p: DragStopEventParams): void;
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
    /**
     * Lookup a target definition on the given element.
     * @param fromElement Element to lookup the source definition
     * @param evt Associated mouse event - for instance, the event that started a drag.
     * @private
     */
    private _getTargetDefinition;
    private _getDropEndpoint;
    private _doForceReattach;
    private _shouldReattach;
    private _maybeReattach;
    private _discard;
    private _drop;
    private _registerFloatingConnection;
    private getFloatingAnchorIndex;
}
