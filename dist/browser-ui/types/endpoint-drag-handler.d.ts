import { DragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { Drag, DragStartEventParams, DragStopEventParams, DragEventParams } from "./collicat";
import { FloatingAnchor, BoundingBox, Connection, Dictionary, Endpoint, EndpointRepresentation, SourceOrTargetDefinition } from "@jsplumb/core";
export declare class EndpointDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    jpc: Connection;
    existingJpc: boolean;
    private _originalAnchor;
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
    floatingAnchor: FloatingAnchor;
    _stopped: boolean;
    inPlaceCopy: any;
    endpointDropTargets: Array<{
        el: jsPlumbDOMElement;
        endpoint: Endpoint;
        r: BoundingBox;
        def?: SourceOrTargetDefinition;
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
    onDragInit(el: Element): Element;
    onDragAbort(el: Element): void;
    /**
     * Makes the element that is the placeholder for dragging. This element gets `managed` by the instance, and `unmanaged` when dragging
     * ends.
     * @param ipco
     * @param ips
     * @private
     */
    private _makeDraggablePlaceholder;
    private _cleanupDraggablePlaceholder;
    reset(): void;
    init(drag: Drag): void;
    private startNewConnectionDrag;
    private startExistingConnectionDrag;
    /**
     * Returns whether or not a connerction drag should start, and, if so, optionally returns a payload to associate with the drag.
     * @private
     */
    private _shouldStartDrag;
    /**
     * Creates the floating endpoint used in a connection drag.
     * @param canvasElement
     * @private
     */
    private _createFloatingEndpoint;
    /**
     * Populate the list of drop targets based upon what is being dragged.
     * @param canvasElement
     * @private
     */
    private _populateTargets;
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
    private _getSourceDefinitionFromElement;
    /**
     * Looks for a source selector on the instance that matches the target of the given event.
     * @param evt
     * @private
     */
    private _getSourceDefinitionFromInstance;
    /**
     * Create - or retrieve - an appropriate endpoint for a connection drop.
     * @param p
     * @param jpc
     * @private
     */
    private _getDropEndpoint;
    private _doForceReattach;
    private _shouldReattach;
    private _discard;
    private _drop;
    private _registerFloatingConnection;
    private getFloatingAnchorIndex;
}
