import { DragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { Drag, DragStartEventParams, DragStopEventParams, DragEventParams, BeforeStartEventParams } from "./collicat";
import { BoundingBox } from "../util/util";
import { Endpoint } from "../core/endpoint/endpoint";
import { EndpointRepresentation } from "../core/endpoint/endpoints";
import { LightweightFloatingAnchor } from "../core/factory/anchor-record-factory";
import { SourceOrTargetDefinition } from "../core/type-descriptors";
import { Connection } from "../core/connector/connection-impl";
declare type EndpointDropTarget = {
    el: jsPlumbDOMElement;
    endpoint: Endpoint;
    r: BoundingBox;
    def?: SourceOrTargetDefinition;
    targetEl: jsPlumbDOMElement;
    rank?: number;
};
/**
 * Handles dragging of connections between endpoints.
 * @internal
 */
export declare class EndpointDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    jpc: Connection;
    existingJpc: boolean;
    private _originalAnchorSpec;
    ep: Endpoint<Element>;
    endpointRepresentation: EndpointRepresentation<any>;
    canvasElement: Element;
    private _activeDefinition;
    placeholderInfo: {
        id?: string;
        element?: jsPlumbDOMElement;
    };
    floatingIndex: number;
    floatingId: string;
    floatingElement: Element;
    floatingEndpoint: Endpoint;
    floatingAnchor: LightweightFloatingAnchor;
    _stopped: boolean;
    inPlaceCopy: any;
    endpointDropTargets: Array<EndpointDropTarget>;
    currentDropTarget: any;
    payload: any;
    floatingConnections: Record<string, Connection>;
    _forceReattach: boolean;
    _forceDetach: boolean;
    mousedownHandler: (e: any) => void;
    mouseupHandler: (e: any) => void;
    selector: string;
    constructor(instance: BrowserJsPlumbInstance);
    private _resolveDragParent;
    private _mousedownHandler;
    /**
     * cleans up any endpoints added from a mousedown on a source that did not result in a connection drag replaces
     * what in previous versions was a mousedown/mouseup handler per element.
     * @param e
     * @internal
     */
    private _mouseupHandler;
    /**
     * At the beginning of a drag, this method can be used to perform some setup in a handler, and if it returns a DOM
     * element, that element will be the one used for dragging.
     * @param el The element that will be dragged unless we return something different.
     * @internal
     */
    onDragInit(el: Element): Element;
    /**
     * @internal
     * @param el
     */
    onDragAbort(el: Element): void;
    /**
     * Makes the element that is the placeholder for dragging. This element gets `managed` by the instance, and `unmanaged` when dragging
     * ends.
     * @param ipco
     * @param ips
     * @internal
     */
    private _makeDraggablePlaceholder;
    private _cleanupDraggablePlaceholder;
    /**
     * @internal
     */
    reset(): void;
    /**
     * @internal
     * @param drag
     */
    init(drag: Drag): void;
    /**
     * @internal
     * @param scope
     * @param data
     */
    private startNewConnectionDrag;
    /**
     * Starts the drag of an existing connection, either by its target or its source.
     * @internal
     */
    private startExistingConnectionDrag;
    /**
     * Returns whether or not a connection drag should start, and, if so, optionally returns a payload to associate with the drag.
     * @internal
     */
    private _shouldStartDrag;
    /**
     * Creates the floating endpoint used in a connection drag.
     * @param canvasElement
     * @internal
     */
    private _createFloatingEndpoint;
    /**
     * Populate the list of drop targets based upon what is being dragged.
     * @param canvasElement Element that the connection drag has started on.
     * @param event The event that instigated a connection drag
     * @internal
     */
    private _populateTargets;
    /**
     * For a given drag selector, find the current list of target elements that match, according to the selector's redrop policy.
     * @param dragSelector
     * @internal
     */
    private _findTargetZones;
    onStart(p: DragStartEventParams): boolean;
    onBeforeStart(beforeStartParams: BeforeStartEventParams): void;
    onDrag(params: DragEventParams): boolean;
    private _maybeCleanup;
    private _reattachOrDiscard;
    onStop(p: DragStopEventParams): void;
    /**
     * Looks for a source selector on the instance that matches the target of the given event.
     * @param evt
     * @internal
     */
    private _getSourceDefinition;
    /**
     * Create - or retrieve - an appropriate endpoint for a connection drop.
     * @param p
     * @param jpc
     * @internal
     */
    private _getDropEndpoint;
    private _doForceReattach;
    private _shouldReattach;
    private _discard;
    private _drop;
    private _registerFloatingConnection;
    private _getFloatingAnchorIndex;
}
export {};
//# sourceMappingURL=endpoint-drag-handler.d.ts.map