import { ElementDragHandler } from "./element-drag-handler";
import { GhostProxyingDragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { DragEventParams, Drag, DragStopEventParams } from "./collicat";
export declare class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {
    protected instance: BrowserJsPlumbInstance;
    selector: string;
    doRevalidate: (el: jsPlumbDOMElement) => void;
    constructor(instance: BrowserJsPlumbInstance);
    reset(): void;
    private _revalidate;
    init(drag: Drag): void;
    useGhostProxy(container: any, dragEl: Element): boolean;
    /**
     * Makes the element that acts as a ghost proxy.
     * @param el
     */
    makeGhostProxy(el: Element): Element;
    onDrag(params: DragEventParams): void;
    onDragAbort(el: jsPlumbDOMElement): void;
    onStop(params: DragStopEventParams): void;
    /**
     * Perhaps prune or orphan the element represented by the given drag params.
     * @param params
     * @param doNotTransferToAncestor Used when dealing with nested groups. When true, it means remove the element from any groups; when false, which is
     * the default, elements that are orphaned will be added to this group's ancestor, if it has one.
     * @param isDefinitelyNotInsideParent Used internally when this method is called and we've already done an intersections test. This flag saves us repeating the calculation.
     * @private
     */
    private _pruneOrOrphan;
}
